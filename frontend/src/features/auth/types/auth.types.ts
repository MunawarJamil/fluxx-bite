import { z } from 'zod';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export type UserRole = 'customer' | 'rider' | 'seller';
export type AuthProviderType = 'google' | 'local';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  provider: AuthProviderType;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (response: any) => Promise<void>;
  clearError: () => void;
}