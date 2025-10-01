'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
        },
      }}
    />
  );
}
