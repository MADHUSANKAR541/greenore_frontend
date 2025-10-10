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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.guestFlagKey);
      localStorage.removeItem(this.guestUserKey);
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

  // Guest evaluator mode
  async guestLogin(): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
    try {
      // Mock guest login - no backend call needed for evaluation
      const mockGuestUser: User = {
        id: 999,
        email: 'evaluator@greenore.demo',
        name: 'SIH Evaluator'
      };

      // Generate a mock JWT token (expires in 24 hours)
      const mockToken = this.generateMockToken(mockGuestUser);

      const mockResponse: AuthResponse = {
        message: 'Guest login successful',
        accessToken: mockToken,
        user: mockGuestUser
      };

      tokenManager.setToken(mockResponse.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.guestFlagKey, '1');
        localStorage.setItem(this.guestUserKey, JSON.stringify(mockResponse.user));
      }

      return { success: true, data: mockResponse };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Guest login failed',
      };
    }
  }

  private generateMockToken(user: User): string {
    // Create a simple mock JWT token for guest users
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id.toString(),
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      guest: true
    }));
    const signature = btoa('mock-signature-for-guest-token');

    return `${header}.${payload}.${signature}`;
  }

  isGuest(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.guestFlagKey) === '1' && tokenManager.isTokenValid();
  }

  getGuestUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(this.guestUserKey);
    try {
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
