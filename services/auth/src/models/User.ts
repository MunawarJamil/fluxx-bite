import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string | null;
  role: 'customer' | 'rider' | 'seller';
  provider: 'google' | 'local';
  providerId?: string;
  refreshToken?: string | null;
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
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false, // 🔐 never return password
    },

    image: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: ['customer', 'rider', 'seller'],
      default: 'customer',
    },

    provider: {
      type: String,
      enum: ['google', 'local'],
      default: 'google',
    },

    providerId: {
      type: String,
      unique: true,
      sparse: true,
    },

    refreshToken: {
      type: String,
      select: false, // 🔐 hide from queries
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ providerId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IUser>('User', UserSchema);