import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { downloadExcelTemplate } from '../../../bulk/config/downloadExcelTemplate';
import { useImportBulkUsers, usePreviewBulkUsers } from './useUser';
import type { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserScope } from '../types/user.types';
import { getBulkUserTemplate } from '@/features/bulk/config/bulk.template';

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

  const isAkademikMitraContext = scope === 'MITRA' && currentProfile.mitraRoles?.roleCode === 'AKADEMIK';

  const bulkConfig = useMemo(() => getBulkUserTemplate(scope, isAkademikMitraContext), [scope, isAkademikMitraContext]);

  const template = bulkConfig.template;

  const templateRows = bulkConfig.templateRows;

  const rules = bulkConfig.rules;

  useEffect(() => {
    resetPreview();
  }, [scope, resetPreview]);

  const previewResult = previewMutation.data;

  const handleDownloadTemplateCsv = () => {
    const blob = new Blob([template.content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = template.fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplateExcel = () => {
    const excelFileName = template.fileName.replace(/\.csv$/i, '');
    downloadExcelTemplate({
      fileName: excelFileName,
      sheetName: 'Bulk User',
      rows: templateRows,
    });
  };

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
