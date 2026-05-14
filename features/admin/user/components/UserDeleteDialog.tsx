'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { useDeleteUser } from '../hooks/useUser';
import type { UserScope } from '../types/user.types';

type UserDeleteDialogProps = {
  userId: string | null;
  scope?: UserScope;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  description?: string;
};

export function UserDeleteDialog({
  userId,
  scope = 'PLATFORM',
  open,
  onOpenChange,
  onSuccess,
  description = 'Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.',
}: UserDeleteDialogProps) {
  const deleteUserMutation = useDeleteUser();

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      description={description}
      isLoading={deleteUserMutation.isPending}
      onConfirm={() => {
        if (!userId) {
          return;
        }

        deleteUserMutation.mutate({ userId, scope }, {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        });
      }}
    />
  );
}
