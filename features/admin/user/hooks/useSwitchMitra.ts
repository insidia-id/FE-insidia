'use client';

import { useRouter } from 'next/navigation';
import { useSwitchUserMitra } from './useUser';

export function useSwitchUserMitraController(initialMitraId?: string | null) {
  const router = useRouter();
  const switchMitraMutation = useSwitchUserMitra();
  const selectedMitraId = switchMitraMutation.variables?.data.mitraId ?? initialMitraId ?? '';

  const onSelectMitra = (userId: string, mitraId: string) => {
    switchMitraMutation.mutate(
      {
        userId,
        data: { mitraId },
      },
      {
        onSuccess: () => {
          router.push('/auth-redirect');
          router.refresh();
        },
      },
    );
  };

  return {
    selectedMitraId,
    onSelectMitra,
    isSubmitting: switchMitraMutation.isPending,
  };
}
