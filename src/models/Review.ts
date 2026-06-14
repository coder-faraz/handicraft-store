// FILE: src/models/Review.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReview extends Document {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false, // Admin must approve before displaying
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews (one per user per product)
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, isApproved: 1 });
ReviewSchema.index({ userId: 1 });

/**
 * Post-save hook: recalculate product's rating.average and rating.count
 */
ReviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const result = await ReviewSchema.model('Review').aggregate([
    { $match: { productId: this.productId, isApproved: true } },
    {
      $group: {
        _id: '$productId',
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(this.productId, {
      'ratings.average': Math.round(result[0].average * 10) / 10,
      'ratings.count': result[0].count,
    });
  }
});

const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
