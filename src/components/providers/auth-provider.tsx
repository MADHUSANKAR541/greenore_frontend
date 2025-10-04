'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (typeof window === 'undefined') return;
    
    setIsLoading(true);
    
    if (authService.isLoggedIn()) {
      try {
        const result = await authService.getProfile();
        if (result.success && result.data) {
          setUser(result.data);
          setIsAuthenticated(true);
        } else {
          authService.logout();
        }
      } catch (error) {
        authService.logout();
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const result = await authService.register({ name, email, password, confirmPassword });
      
      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      const result = await authService.getProfile();
      if (result.success && result.data) {
        setUser(result.data);
      }
    } catch (error) {
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
