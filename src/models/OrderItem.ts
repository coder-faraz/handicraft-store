// FILE: src/models/OrderItem.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderItem extends Document {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    productImage: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
  },
  {
    timestamps: false,
  }
);

// Indexes
OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ productId: 1 });

const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem ??
  mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);

export default OrderItem;
