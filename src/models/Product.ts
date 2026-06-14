// FILE: src/models/Product.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  images: IProductImage[];
  categoryId: Types.ObjectId;
  stock: number;
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
    },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: effective price (sale price if available)
ProductSchema.virtual('effectivePrice').get(function () {
  return this.salePrice && this.salePrice < this.price
    ? this.salePrice
    : this.price;
});

// Virtual: discount percentage
ProductSchema.virtual('discountPercent').get(function () {
  if (!this.salePrice || this.salePrice >= this.price) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

// Indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ sku: 1 }, { unique: true });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ 'ratings.average': -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' }); // Full-text search

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
