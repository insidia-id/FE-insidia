'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSafeCallbackPath } from '@/auth/redirect';
import { loginEmailSchema, type LoginEmailInput } from '../schema/auth.schema';
import { useRequestOtpLogin } from '../hooks/useauth';

const defaultValues: LoginEmailInput = {
  email: '',
};

export function useLoginEmailController() {
  const router = useRouter();
  const params = useSearchParams();

  const callbackUrl = getSafeCallbackPath(params.get('callbackUrl'));
  const requestOtpMutation = useRequestOtpLogin();

  const form = useForm<LoginEmailInput>({
    resolver: zodResolver(loginEmailSchema),
    defaultValues,
  });

  const onSubmit = (values: LoginEmailInput) => {
    requestOtpMutation.mutate(values, {
      onSuccess: (data) => {
        const query = new URLSearchParams({
          callbackUrl,
          token: data.token,
        });

        router.push(`/login/verify-otp?${query}`);

        form.reset(defaultValues);
      },
    });
  };

  const submit = form.handleSubmit(onSubmit);

  return {
    form,
    submit,
    requestOtpMutation,
  };
}
