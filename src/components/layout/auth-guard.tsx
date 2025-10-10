'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';
import PlanetLoader from './PlanetLoader';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    // For testing: Show loader for 5 seconds
    setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    // Check if user is authenticated
    const checkAuth = async () => {
      if (authService.isGuest()) {
        // Guest sessions are allowed; skip remote validation
        setIsChecking(false);
        return;
      }

      if (authService.isLoggedIn()) {
        try {
          // Validate token by calling profile endpoint
          const result = await authService.getProfile();
          if (result.success) {
            // Keep checking until timeout
            return;
          }
        } catch (error) {
          // Token is invalid
          console.error('Authentication check failed:', error);
        }
      }

      // Redirect to login if not authenticated
      router.push('/login');
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  // Show loading animation while checking authentication
  if (isChecking && !isPublicRoute) {
    return <PlanetLoader />;
  }

  return <>{children}</>;
}