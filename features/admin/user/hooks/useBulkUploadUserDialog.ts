import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useImportBulkUsers, usePreviewBulkUsers } from './useUser';
import type { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserScope } from '../types/user.types';
import { getBulkUserTemplate } from '@/features/bulk/config/bulk.template';
import { getActiveMitraContext } from '../HelperUser';

type UseBulkUploadUserDialogProps = {
  currentProfile: AuthProfileResponse;
  scope: UserScope;
};

export function useBulkUploadUserDialog({ currentProfile, scope }: UseBulkUploadUserDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const previewMutation = usePreviewBulkUsers();
  const importMutation = useImportBulkUsers();
  const resetPreview = previewMutation.reset;
  const resetImport = importMutation.reset;
  const { activeMitraRole } = getActiveMitraContext(currentProfile);

  const isAkademikMitraContext = scope === 'MITRA' && activeMitraRole === 'AKADEMIK';

  const bulkConfig = useMemo(() => getBulkUserTemplate(scope, isAkademikMitraContext), [scope, isAkademikMitraContext]);

  const template = bulkConfig.template;

  const templateRows = bulkConfig.templateRows;

  const rules = bulkConfig.rules;

  useEffect(() => {
    resetPreview();
  }, [scope, resetPreview]);

  const previewResult = previewMutation.data;

  const handlePreview = () => {
    if (!file) {
      return;
    }

    previewMutation.mutate(file);
  };

  const handleImport = async () => {
    if (!previewResult?.jobId || !previewResult.canImport) {
      return;
    }

    await importMutation.mutateAsync(previewResult.jobId);
    handleOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setFile(null);
      resetPreview();
      resetImport();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    resetPreview();
  };

  return {
    open,
    file,
    fileInputRef,
    importMutation,
    previewMutation,
    previewResult,
    rules,
    template,
    templateRows,
    handleFileChange,
    handleImport,
    handleOpenChange,
    handlePreview,
  };
}
