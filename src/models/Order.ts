// FILE: src/models/Order.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderNumber: string;
  items: Types.ObjectId[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  razorpayOrderId?: string;
  orderStatus:
    | 'placed'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  trackingId?: string;
  courierName?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
      },
    ],
    shippingAddress: {
      type: ShippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCharge: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: {
      type: String,
      trim: true,
    },
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'placed',
    },
    trackingId: {
      type: String,
      trim: true,
    },
    courierName: {
      type: String,
      trim: true,
    },
    trackingUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
