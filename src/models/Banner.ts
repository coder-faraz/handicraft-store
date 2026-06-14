// FILE: src/models/Banner.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  position: 'hero' | 'mid' | 'footer';
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    image: {
      url: { type: String, required: [true, 'Banner image URL is required'] },
      publicId: { type: String, required: [true, 'Cloudinary public ID is required'] },
    },
    link: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      enum: ['hero', 'mid', 'footer'],
      required: [true, 'Banner position is required'],
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
BannerSchema.index({ position: 1, isActive: 1, sortOrder: 1 });

const Banner: Model<IBanner> =
  mongoose.models.Banner ?? mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
