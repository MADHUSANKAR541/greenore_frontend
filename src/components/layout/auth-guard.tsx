'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

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
    }, 5000);

    // Check if user is authenticated
    const checkAuth = async () => {
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

  // Show metal-themed loading animation while checking authentication
  if (isChecking && !isPublicRoute) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        color: '#f7fafc'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px'
        }}>
          {/* Metal forge/refining animation */}
          <div style={{ position: 'relative' }}>
            {/* Molten metal container */}
            <div style={{
              width: '120px',
              height: '80px',
              background: 'linear-gradient(to top, #1a202c, #4a5568)',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Molten metal surface */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '20px',
                background: 'linear-gradient(90deg, #ff6b35, #ff8c42, #ffb74d)',
                animation: 'molten-flow 2s ease-in-out infinite'
              }}></div>
              
              {/* Heat shimmer effect */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '0',
                right: '0',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                animation: 'heat-shimmer 1.5s linear infinite'
              }}></div>
            </div>

            {/* Sparks flying up */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <div style={{
                width: '3px',
                height: '3px',
                backgroundColor: '#ff6b35',
                borderRadius: '50%',
                animation: 'spark-1 2s ease-in-out infinite'
              }}></div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '40%',
              transform: 'translateX(-40%)'
            }}>
              <div style={{
                width: '2px',
                height: '2px',
                backgroundColor: '#ff8c42',
                borderRadius: '50%',
                animation: 'spark-2 2.5s ease-in-out infinite'
              }}></div>
            </div>
            <div style={{
              position: 'absolute',
              top: '-25px',
              left: '60%',
              transform: 'translateX(-60%)'
            }}>
              <div style={{
                width: '2.5px',
                height: '2.5px',
                backgroundColor: '#ffb74d',
                borderRadius: '50%',
                animation: 'spark-3 2.2s ease-in-out infinite'
              }}></div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              background: 'linear-gradient(45deg, #ff6b35, #ffb74d, #ffd700)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>GreenOre</h3>
            <p style={{
              fontSize: '14px',
              color: '#a0aec0',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ animation: 'pulse 2s ease-in-out infinite' }}>⚗️</span>
              Refining sustainability
              <span style={{ animation: 'pulse 2s ease-in-out infinite', animationDelay: '1s' }}>⚗️</span>
            </p>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes molten-flow {
                0%, 100% { transform: translateX(-10px) scale(1); }
                25% { transform: translateX(5px) scale(1.05); }
                50% { transform: translateX(10px) scale(0.95); }
                75% { transform: translateX(-5px) scale(1.02); }
              }
              
              @keyframes heat-shimmer {
                0% { transform: translateX(-100px); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateX(100px); opacity: 0; }
              }
              
              @keyframes spark-1 {
                0%, 100% { 
                  transform: translateY(0) translateX(0) scale(0);
                  opacity: 0;
                }
                15% { 
                  transform: translateY(-5px) translateX(2px) scale(1);
                  opacity: 1;
                }
                30% { 
                  transform: translateY(-15px) translateX(5px) scale(0.8);
                  opacity: 0.8;
                }
                45% { 
                  transform: translateY(-25px) translateX(8px) scale(0.6);
                  opacity: 0.4;
                }
                60% { 
                  transform: translateY(-35px) translateX(10px) scale(0.2);
                  opacity: 0.2;
                }
              }
              
              @keyframes spark-2 {
                0%, 100% { 
                  transform: translateY(0) translateX(0) scale(0);
                  opacity: 0;
                }
                20% { 
                  transform: translateY(-8px) translateX(-3px) scale(1);
                  opacity: 1;
                }
                40% { 
                  transform: translateY(-20px) translateX(-6px) scale(0.7);
                  opacity: 0.6;
                }
                60% { 
                  transform: translateY(-32px) translateX(-9px) scale(0.3);
                  opacity: 0.3;
                }
              }
              
              @keyframes spark-3 {
                0%, 100% { 
                  transform: translateY(0) translateX(0) scale(0);
                  opacity: 0;
                }
                25% { 
                  transform: translateY(-6px) translateX(4px) scale(1);
                  opacity: 0.9;
                }
                50% { 
                  transform: translateY(-18px) translateX(7px) scale(0.5);
                  opacity: 0.5;
                }
                75% { 
                  transform: translateY(-28px) translateX(9px) scale(0.2);
                  opacity: 0.1;
                }
              }
              
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.2); opacity: 1; }
              }
            `
          }} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}