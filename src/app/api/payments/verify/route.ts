// FILE: src/app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import Product from '@/models/Product';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, dbOrderId } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !dbOrderId) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(razorpay_payment_id, razorpay_order_id, razorpay_signature);
    
    if (!isValid) {
      await connectDB();
      await Order.findByIdAndUpdate(dbOrderId, { paymentStatus: 'failed' });
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(dbOrderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ success: true, orderId: order._id, message: 'Already paid' });
    }

    // Update order status
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentId = razorpay_payment_id;
    await order.save();

    // Decrement stock
    const orderItems = await OrderItem.find({ orderId: order._id });
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
