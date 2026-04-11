import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { 
  AuthContextType, 
  AuthState, 
  User, 
  LoginFormData, 
  RegisterFormData 
} from '../types/auth.types';
import * as authApi from '../services/auth.api';
import toast from 'react-hot-toast';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Bootstrap function to check if user is logged in
  const bootstrap = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      if (response.data) {
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      }
    } catch (err) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Listen for global logout event from axios interceptor
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (data: LoginFormData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.login(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.register(data);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const socialLogin = async (idToken: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.socialLogin(idToken);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Social login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      dispatch({ type: 'LOGOUT' }); // Still logout locally if server fails
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        socialLogin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
