// FILE: src/models/Category.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image: {
    url: string;
    publicId: string;
  };
  parentId?: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ isActive: 1, sortOrder: 1 });

const Category: Model<ICategory> =
  mongoose.models.Category ??
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
