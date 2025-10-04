'use client';

import { useState } from 'react';
import { NavBar } from './navbar';
import { SideNav } from './sidenav';
import { ToastProvider } from '../providers/toast-provider';
import { AuthGuard } from './auth-guard';
import styles from './main-layout.module.scss';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  const toggleSideNav = () => {
    setIsSideNavCollapsed(!isSideNavCollapsed);
  };

  return (
    <AuthGuard>
      <div className={styles.layout}>
        <NavBar />
        <div className={styles.layout__content}>
          {!isLanding && (
            <SideNav 
              isCollapsed={isSideNavCollapsed} 
              onToggle={toggleSideNav} 
            />
          )}
          <main className={`${styles.main} ${isSideNavCollapsed ? styles.main__collapsed : ''} ${isLanding ? styles.main__noSidebar : ''}`}>
            <div className={styles.main__container}>
              {children}
            </div>
          </main>
        </div>
        <ToastProvider />
      </div>
    </AuthGuard>
  );
}
