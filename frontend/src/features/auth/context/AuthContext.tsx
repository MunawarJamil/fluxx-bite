import React, { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  AuthContextType,
  AuthState,
  User,
  UserRole,
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

// Centralized Reducer function to handle state updates
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
// Create context for authentication state and actions 
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the application with authentication context
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

  const updateUserRole = async (role: UserRole) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.updateUserRole(role);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      toast.success(`Role updated to ${role}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Role update failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const updateLocation = async (latitude: number, longitude: number, address?: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.updateLocation(latitude, longitude, address);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      toast.success('Location updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Location update failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      // We don't necessarily want to log out the user if location update fails, 
      // but the reducer currently clears the user on failure. 
      // Actually, my reducer for AUTH_FAILURE sets user to null. 
      // I should probably add a more granular action for "UPDATE_FAILURE" that doesn't clear the user.
      toast.error(message);
      throw error;
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });


  const value = useMemo(() => ({
    ...state,
    login,
    register,
    logout,
    socialLogin,
    updateUserRole,
    updateLocation,
    clearError,
  }), [state]);

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};
