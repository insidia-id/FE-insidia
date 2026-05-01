'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getSafeCallbackPath } from '@/auth/redirect';
import { verifyAuthOtpSchema, type VerifyAuthOtpInput } from '../schema/auth.schema';

type UseVerifyOtpControllerProps = {
  callbackUrl?: string;
  token: string;
};

export function useVerifyOtpController({ callbackUrl, token }: UseVerifyOtpControllerProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const safeCallbackUrl = getSafeCallbackPath(callbackUrl);

  const form = useForm<VerifyAuthOtpInput>({
    resolver: zodResolver(verifyAuthOtpSchema),
    defaultValues: {
      token,
      otp: '',
    },
  });

  const onSubmit = async (values: VerifyAuthOtpInput) => {
    setIsSubmitting(true);

    try {
      const result = await signIn('credentials', {
        ...values,
        redirect: false,
        redirectTo: safeCallbackUrl,
      });
      console.log('SIGNIN RESULT', result);
      if (result?.error === 'CredentialsSignin') {
        form.setError('otp', { message: 'OTP salah atau kadaluarsa.' });
        return;
      }

      toast.success('Login berhasil.');
      router.replace(getSafeCallbackPath(result.url ?? safeCallbackUrl));
      router.refresh();
    } catch {
      toast.error('Verifikasi OTP gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submit: form.handleSubmit(onSubmit),
  };
}
