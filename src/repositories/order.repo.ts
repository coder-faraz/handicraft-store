// FILE: src/repositories/order.repo.ts
import { connectDB } from '@/lib/db';
import Order, { IOrder } from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { FilterQuery } from 'mongoose';
import { generateOrderNumber } from '@/lib/utils';

export interface CreateOrderData {
  userId: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  razorpayOrderId?: string;
  notes?: string;
}

export interface TrackingData {
  courierName?: string;
  trackingId?: string;
  trackingUrl?: string;
}

export async function findAll(
  filters: {
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
  } = {},
  page: number = 1,
  limit: number = 20
): Promise<{ orders: IOrder[]; total: number }> {
  await connectDB();

  const query: FilterQuery<IOrder> = {};
  if (filters.orderStatus) query.orderStatus = filters.orderStatus;
  if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
  if (filters.search) {
    query.$or = [
      { orderNumber: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  return { orders: orders as IOrder[], total };
}

export async function findById(id: string): Promise<IOrder | null> {
  await connectDB();
  return Order.findById(id)
    .populate('userId', 'name email phone')
    .populate({
      path: 'items',
      model: 'OrderItem',
    });
}

export async function findByUser(userId: string): Promise<IOrder[]> {
  await connectDB();
  return Order.find({ userId })
    .sort({ createdAt: -1 })
    .populate('items')
    .lean() as Promise<IOrder[]>;
}

export async function create(data: CreateOrderData): Promise<IOrder> {
  await connectDB();

  const orderNumber = generateOrderNumber();

  // Create order shell
  const order = await Order.create({
    userId: data.userId,
    orderNumber,
    items: [],
    shippingAddress: data.shippingAddress,
    subtotal: data.subtotal,
    shippingCharge: data.shippingCharge,
    discount: data.discount,
    total: data.total,
    paymentStatus: 'pending',
    orderStatus: 'placed',
    razorpayOrderId: data.razorpayOrderId,
    notes: data.notes,
  });

  // Create order items
  const orderItems = await OrderItem.insertMany(
    data.items.map((item) => ({
      orderId: order._id,
      ...item,
    }))
  );

  // Link items to order
  order.items = orderItems.map((i) => i._id) as any;
  await order.save();

  return order;
}

export async function updateStatus(
  id: string,
  orderStatus: IOrder['orderStatus'],
  paymentStatus?: IOrder['paymentStatus']
): Promise<IOrder | null> {
  await connectDB();
  const update: Partial<IOrder> = { orderStatus };
  if (paymentStatus) update.paymentStatus = paymentStatus;
  return Order.findByIdAndUpdate(id, { $set: update }, { new: true });
}

export async function updateTracking(
  id: string,
  data: TrackingData & { orderStatus?: IOrder['orderStatus'] }
): Promise<IOrder | null> {
  await connectDB();
  return Order.findByIdAndUpdate(id, { $set: data }, { new: true });
}

export async function getOrderStats(): Promise<{
  total: number;
  revenue: number;
  pending: number;
  todayOrders: number;
}> {
  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, revenueResult, pending, todayOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.countDocuments({ orderStatus: 'placed' }),
    Order.countDocuments({ createdAt: { $gte: today } }),
  ]);

  return {
    total,
    revenue: revenueResult[0]?.total ?? 0,
    pending,
    todayOrders,
  };
}

export async function getRecentOrders(limit: number = 10): Promise<IOrder[]> {
  await connectDB();
  return Order.find({})
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() as Promise<IOrder[]>;
}
