import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);

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
  matchPassword(enteredPassword: string): Promise<boolean>;
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
      unique: true,
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
      sparse: true,
      unique: true,
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

// 🔐 Encrypt password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(this.password, salt, 64)) as Buffer;
  this.password = `${salt}:${derivedKey.toString('hex')}`;
});

// ✅ Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;

  const [salt, key] = this.password.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = (await scrypt(enteredPassword, salt, 64)) as Buffer;

  // 🛡 Use timingSafeEqual to prevent timing attacks
  if (keyBuffer.length !== derivedKey.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
};


export default mongoose.model<IUser>('User', UserSchema);