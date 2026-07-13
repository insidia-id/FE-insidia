'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { SessionGuard } from './SessionGuard';

type AuthSessionProviderProps = {
  children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <SessionGuard />
      {children}
    </SessionProvider>
  );
}
