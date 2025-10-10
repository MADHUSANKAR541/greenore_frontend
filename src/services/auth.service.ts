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
  private guestFlagKey = 'guest_mode';
  private guestUserKey = 'guest_user';
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
    // Clear guest flags
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.guestFlagKey);
        localStorage.removeItem(this.guestUserKey);
      } catch { }
    }
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

  // Frontend-only Guest evaluator mode
  async guestLogin(): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
    try {
      const mockGuestUser: User = {
        id: 999999,
        email: 'guest@greenore.demo',
        name: 'guest',
      };

      const accessToken = this.generateMockToken(mockGuestUser);
      const data: AuthResponse = {
        message: 'Guest login successful',
        accessToken,
        user: mockGuestUser,
      };

      tokenManager.setToken(accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.guestFlagKey, '1');
        localStorage.setItem(this.guestUserKey, JSON.stringify(mockGuestUser));
      }

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Guest login failed',
      };
    }
  }

  isGuest(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      // Guest mode should not depend on token presence/validity
      return localStorage.getItem(this.guestFlagKey) === '1';
    } catch {
      return false;
    }
  }

  getGuestUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.guestUserKey);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private generateMockToken(user: User): string {
    // Create a simple mock JWT token for guest users (expires in 24h)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: String(user.id),
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        role: 'guest_evaluator',
        guest: true,
      })
    );
    const signature = btoa('guest-signature');
    return `${header}.${payload}.${signature}`;
  }
}

export const authService = new AuthService();