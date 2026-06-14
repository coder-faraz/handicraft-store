// FILE: src/models/Address.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAddress extends Document {
  userId: Types.ObjectId;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number'],
    },
    addressLine1: {
      type: String,
      required: [true, 'Address Line 1 is required'],
      trim: true,
      maxlength: [200, 'Address Line 1 cannot exceed 200 characters'],
    },
    addressLine2: {
      type: String,
      trim: true,
      maxlength: [200, 'Address Line 2 cannot exceed 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot exceed 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      maxlength: [100, 'State cannot exceed 100 characters'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AddressSchema.index({ userId: 1 });
AddressSchema.index({ userId: 1, isDefault: 1 });

const Address: Model<IAddress> =
  mongoose.models.Address ?? mongoose.model<IAddress>('Address', AddressSchema);

export default Address;
