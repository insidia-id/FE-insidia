'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/ButtonLoading';

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
};
export function ConfirmDeleteDialog({ open, onOpenChange, title = 'Konfirmasi Hapus', description, confirmText = 'Hapus', cancelText = 'Batal', isLoading = false, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelText}
          </Button>

          <LoadingButton type="button" variant="destructive" isLoading={isLoading} onClick={onConfirm}>
            {isLoading ? 'Menghapus...' : confirmText}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
