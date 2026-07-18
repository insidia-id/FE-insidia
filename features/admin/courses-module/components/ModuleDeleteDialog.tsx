'use client';

import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { CourseModule } from '@/features/admin/courses-module/types/courses-module.types';

interface ModuleDeleteDialogProps {
  module: CourseModule | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function ModuleDeleteDialog({ module, onOpenChange, onConfirm, isDeleting }: ModuleDeleteDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={Boolean(module)}
      onOpenChange={onOpenChange}
      description={`Modul "${module?.title ?? ''}" akan dihapus dari mata pelajaran ini. Semua materi pembelajaran di dalam modul ini juga akan terhapus.`}
      isLoading={isDeleting}
      onConfirm={onConfirm}
    />
  );
}
