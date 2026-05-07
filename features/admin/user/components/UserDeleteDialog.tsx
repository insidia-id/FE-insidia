'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { useDeleteUser } from '../hooks/useUser';

type UserDeleteDialogProps = {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  description?: string;
};

export function UserDeleteDialog({
  userId,
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

        deleteUserMutation.mutate(userId, {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        });
      }}
    />
  );
}
