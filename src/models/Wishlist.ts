// FILE: src/models/Wishlist.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // one wishlist per user
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index
WishlistSchema.index({ userId: 1 }, { unique: true });

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ?? mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default Wishlist;
