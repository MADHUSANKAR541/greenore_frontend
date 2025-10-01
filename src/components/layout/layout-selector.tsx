'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from './main-layout';

export function LayoutSelector({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bareRoutes = ['/login', '/signup'];

  if (bareRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}


