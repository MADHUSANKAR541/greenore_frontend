import { apiService, tokenManager, handleApiError } from '@/utils/api';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface ProfileResponse {
  id: number;
  email: string;
  name: string;
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/register', credentials);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        // Store the JWT token
        tokenManager.setToken(response.data.accessToken);
        
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        // Store the JWT token
        tokenManager.setToken(response.data.accessToken);
        
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  async getProfile(): Promise<{ success: boolean; data?: ProfileResponse; error?: string }> {
    try {
      const response = await apiService.get<ProfileResponse>('/auth/profile');
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      if (response.data) {
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Failed to get profile' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get profile' 
      };
    }
  }

  logout(): void {
    tokenManager.removeToken();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  isLoggedIn(): boolean {
    return tokenManager.isTokenValid();
  }

  getToken(): string | null {
    return tokenManager.getToken();
  }

  getUserSession(): { isAuthenticated: boolean; needsLogin: boolean } {
    const token = tokenManager.getToken();
    const isValid = tokenManager.isTokenValid();
    
    return {
      isAuthenticated: !!token && isValid,
      needsLogin: !token || !isValid,
    };
  }
}

export const authService = new AuthService();