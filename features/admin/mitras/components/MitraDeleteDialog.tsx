'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';

type MitraDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  description?: string;
};

export function MitraDeleteDialog({ open, onOpenChange, onConfirm, isLoading, description = 'Apakah Anda yakin ingin menghapus mitra ini? Tindakan ini tidak dapat dibatalkan.' }: MitraDeleteDialogProps) {
  return <ConfirmDeleteDialog open={open} onOpenChange={onOpenChange} description={description} isLoading={isLoading} onConfirm={onConfirm} />;
}
