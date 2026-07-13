'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { requestOtpLogin } from '../api/api.client';
import type { LoginEmailInput } from '../schema/auth.schema';
import { logout } from '../api/api';
import { signOut } from 'next-auth/react';

export const useRequestOtpLogin = () => {
  return useMutation({
    mutationFn: (email: LoginEmailInput) => requestOtpLogin(email),

    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'gagal request Otp'));
    },
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await logout();
      } catch (error) {
        console.error('LOGOUT_REQUEST_FAILED', error);
      }

      return signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/';
    },
  });
};
