import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useImportBulkModulesPermission, usePreviewBulkModulesPermission } from './use-module-permission-query';
import { getBulkModulePermissionTemplate } from '@/features/bulk/config/bulk.template';

export function useBulkModulePermission() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const previewMutation = usePreviewBulkModulesPermission();
  const importMutation = useImportBulkModulesPermission();

  const resetPreview = previewMutation.reset;
  const resetImport = importMutation.reset;
  const bulkConfig = useMemo(() => getBulkModulePermissionTemplate(), []);

  const template = bulkConfig.template;

  const templateRows = bulkConfig.templateRows;

  const rules = bulkConfig.rules;

  useEffect(() => {
    resetPreview();
  }, [resetPreview]);

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
    template,
    templateRows,
    importMutation,
    previewMutation,
    previewResult,
    rules,
    handleFileChange,
    handleImport,
    handleOpenChange,
    handlePreview,
  };
}
