import mongoose, { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string | null | undefined;
  role: 'customer' | 'rider' | 'seller' | null | undefined;
  googleAccessToken?: string | null | undefined;
  googleRefreshToken?: string | null | undefined;
  googleTokenExpiry?: number | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'rider', 'seller'],
      default: null,
    },
    googleAccessToken: {
      type: String,
      default: null,
    },
    googleRefreshToken: {
      type: String,
      default: null,
    },
    googleTokenExpiry: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', UserSchema);
