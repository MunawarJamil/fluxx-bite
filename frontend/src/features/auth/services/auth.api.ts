import api from '../../../api/axios';
import type { LoginFormData, RegisterFormData, User } from '../types/auth.types';

export interface AuthResponse {
  success: boolean;
  data: User;
}

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>('/auth/me');
  return response.data;
};

export const socialLogin = async (code: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/social-login', { code });
  return response.data;
};

export const updateUserRole = async (role: string): Promise<AuthResponse> => {
  const response = await api.put<AuthResponse>('/auth/role', { role });
  return response.data;
};

export const updateLocation = async (latitude: number, longitude: number, address?: string): Promise<AuthResponse> => {
  const response = await api.patch<AuthResponse>('/auth/location', { latitude, longitude, address });
  return response.data;
};
