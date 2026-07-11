'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';

export default function ForceLogoutPage() {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    const run = async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('FORCE_LOGOUT_REQUEST_FAILED', error);
      }

      try {
        await signOut({ redirect: false });
      } catch (error) {
        console.error('FORCE_LOGOUT_SIGNOUT_FAILED', error);
      }

      window.location.replace('/login?reason=banned');
    };

    void run();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">Sesi kamu sedang diakhiri</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Akun ini sudah tidak bisa dipakai untuk login. Kamu akan diarahkan kembali ke halaman masuk.</p>
      </div>
    </main>
  );
}
