import mongoose, { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin' | 'partner';
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
      enum: ['user', 'admin', 'partner'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', UserSchema);
