'use client';

import { useCallback, useEffect, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';

const SESSION_CHECK_COOLDOWN = 30_000;
const SESSION_CHECK_TIMEOUT = 5_000;

export function SessionGuard() {
  const { data: session, status } = useSession();

  const isHandlingRedirect = useRef(false);
  const lastCheckedAt = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasSessionUser = Boolean(session?.user);
  const sessionUserId = session?.user?.id;

  const redirectToForceLogout = useCallback(() => {
    if (isHandlingRedirect.current) return;

    isHandlingRedirect.current = true;
    window.location.replace('/force-logout');
  }, []);

  const redirectToLogin = useCallback(async () => {
    if (isHandlingRedirect.current) return;

    isHandlingRedirect.current = true;

    await signOut({
      redirect: true,
      callbackUrl: '/login',
    });
  }, []);

  useEffect(() => {
    if (session?.error === 'SessionExpired' || session?.error === 'RefreshAccessTokenError') {
      void redirectToLogin();
    }
  }, [session?.error, redirectToLogin]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!hasSessionUser) {
      isHandlingRedirect.current = false;
      lastCheckedAt.current = 0;
      return;
    }

    if (window.location.pathname === '/force-logout') return;

    let isMounted = true;

    const validateSession = async () => {
      if (isHandlingRedirect.current) return;

      const now = Date.now();

      if (now - lastCheckedAt.current < SESSION_CHECK_COOLDOWN) {
        return;
      }

      lastCheckedAt.current = now;

      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const timeoutId = window.setTimeout(() => {
        controller.abort();
      }, SESSION_CHECK_TIMEOUT);

      try {
        const response = await fetch('/api/auth/session-status', {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (response.status === 403) {
          const data = await response.json().catch(() => null);

          if (data?.code === 'USER_BANNED') {
            redirectToForceLogout();
            return;
          }

          return;
        }

        if (response.status === 401) {
          await redirectToLogin();
          return;
        }
        if (response.status >= 500) {
          console.warn('SESSION_STATUS_SERVER_ERROR');
          return;
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.warn('SESSION_GUARD_VALIDATION_FAILED');
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    const handleFocus = () => {
      void validateSession();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void validateSession();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();

      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, hasSessionUser, sessionUserId, redirectToForceLogout, redirectToLogin]);

  return null;
}
