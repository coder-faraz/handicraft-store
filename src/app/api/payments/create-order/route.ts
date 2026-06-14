// FILE: src/app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import Product from '@/models/Product';
import { razorpay } from '@/lib/razorpay';
import { CheckoutInputSchema } from '@/validators/order.schema';
import { cookies } from 'next/headers';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf8'));
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, addressData } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const parsedAddress = CheckoutInputSchema.safeParse(addressData);
    if (!parsedAddress.success) {
      return NextResponse.json({ success: false, error: 'Invalid address', details: parsedAddress.error.flatten() }, { status: 400 });
    }

    await connectDB();

    // Determine final address
    let shippingAddress;
    const user = await User.findById(userId);
    
    if (parsedAddress.data.addressId && user) {
      const savedAddress = user.addresses.find(a => a._id?.toString() === parsedAddress.data.addressId);
      if (!savedAddress) return NextResponse.json({ success: false, error: 'Address not found' }, { status: 400 });
      shippingAddress = savedAddress;
    } else if (parsedAddress.data.newAddress) {
      shippingAddress = parsedAddress.data.newAddress;
    } else {
      return NextResponse.json({ success: false, error: 'Address required' }, { status: 400 });
    }

    // Validate stock and calculate total
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json({ success: false, error: `Product ${item.name} is unavailable.` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${product.name}.` }, { status: 400 });
      }
      const price = product.salePrice || product.price;
      const total = price * item.quantity;
      subtotal += total;
      
      validatedItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0]?.url || '',
        quantity: item.quantity,
        price,
        total,
      });
    }

    const shippingCharge = subtotal < 999 ? 60 : 0;
    const discount = 0; // Add coupon logic later if needed
    const finalTotal = subtotal + shippingCharge - discount;

    // Create Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100), // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    if (!rpOrder || !rpOrder.id) {
      return NextResponse.json({ success: false, error: 'Failed to create payment order' }, { status: 500 });
    }

    // Generate Order Number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create DB Order
    const newOrder = await Order.create({
      userId: new mongoose.Types.ObjectId(userId),
      orderNumber,
      items: [], // Will populate below
      shippingAddress,
      subtotal,
      shippingCharge,
      discount,
      total: finalTotal,
      paymentStatus: 'pending',
      razorpayOrderId: rpOrder.id,
      orderStatus: 'placed',
      notes: parsedAddress.data.notes,
    });

    // Create Order Items
    const orderItemIds = [];
    for (const vItem of validatedItems) {
      const orderItem = await OrderItem.create({
        orderId: newOrder._id,
        ...vItem,
      });
      orderItemIds.push(orderItem._id);
    }

    newOrder.items = orderItemIds;
    await newOrder.save();

    return NextResponse.json({
      success: true,
      razorpayOrderId: rpOrder.id,
      amount: finalTotal,
      currency: 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      dbOrderId: newOrder._id,
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
