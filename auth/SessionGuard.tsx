'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function SessionGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'SessionExpired') {
      signOut({ redirectTo: '/login' });
    }
  }, [session?.error]);

  return null;
}
