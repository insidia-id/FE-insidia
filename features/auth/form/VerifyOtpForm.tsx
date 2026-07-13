'use client';

import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { useVerifyOtpController } from '../controller/useVerifyOtpController';

type VerifyOtpFormProps = {
  callbackUrl?: string;
  token: string;
};

export function VerifyOtpForm({ callbackUrl, token }: VerifyOtpFormProps) {
  const { form, isSubmitting, submit } = useVerifyOtpController({ callbackUrl, token });

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input type="hidden" value={token} {...form.register('token')} />

      <TextField
        id="otp"
        label="Kode OTP"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        autoComplete="one-time-code"
        error={readErrorMessage(form.formState.errors, 'otp')}
        disabled={isSubmitting}
        {...form.register('otp')}
      />

      <LoadingButton type="submit" isLoading={isSubmitting}>
        {isSubmitting ? 'Memverifikasi...' : 'Verifikasi OTP'}
      </LoadingButton>
    </form>
  );
}
