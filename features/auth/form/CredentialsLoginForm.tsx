'use client';

import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { useLoginEmailController } from '../controller/useLoginCredentialsController';

export function LoginForm() {
  const { form, submit, requestOtpMutation } = useLoginEmailController();

  const submitting = requestOtpMutation.isPending;

  return (
    <form onSubmit={submit} className="grid gap-4">
      <TextField id="email" label="Email" type="email" placeholder="insidia@gmail.com" error={readErrorMessage(form.formState.errors, 'email')} disabled={submitting} {...form.register('email')} />

      <LoadingButton type="submit" variant="outline" isLoading={submitting}>
        {submitting ? 'Mengirim...' : 'Kirim OTP'}
      </LoadingButton>
    </form>
  );
}
