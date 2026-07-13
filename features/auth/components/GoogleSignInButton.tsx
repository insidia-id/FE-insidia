'use client';

import { useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getSafeCallbackPath } from '@/auth/redirect';

type GoogleSignInButtonProps = {
  callbackUrl?: string;
  disabled?: boolean;
};

export function GoogleSignInButton({ callbackUrl, disabled }: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (disabled) {
      toast.error('Login Google belum dikonfigurasi.');
      return;
    }

    startTransition(() => {
      void signIn('google', {
        redirectTo: getSafeCallbackPath(callbackUrl),
      }).catch(() => {
        toast.error('Login Google gagal. Silakan coba lagi.');
      });
    });
  };

  return (
    <Button
      type="button"
      className="group h-12 w-full rounded-xl border border-gray-200 bg-white font-semibold text-dark-gray shadow-sm transition hover:bg-gray-50"
      disabled={isPending || disabled}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.31h6.45a5.51 5.51 0 0 1-2.39 3.62v3.02h3.86c2.26-2.08 3.57-5.15 3.57-8.68Z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.86-3.02c-1.07.72-2.44 1.14-4.08 1.14-3.13 0-5.79-2.11-6.74-4.95H1.27v3.11A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.26 14.27A7.21 7.21 0 0 1 4.88 12c0-.79.14-1.56.38-2.27V6.62H1.27A12 12 0 0 0 0 12c0 1.93.46 3.76 1.27 5.38l3.99-3.11Z" />
          <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.61 4.59 1.8l3.45-3.45C17.95 1.17 15.24 0 12 0A12 12 0 0 0 1.27 6.62l3.99 3.11c.95-2.84 3.61-4.96 6.74-4.96Z" />
        </svg>
      )}
      {disabled ? 'Google belum aktif' : 'Masuk dengan Google'}
      {!isPending && <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />}
    </Button>
  );
}
