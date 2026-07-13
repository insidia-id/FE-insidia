'use client';

import { BulkUploadDialog } from '@/features/bulk/components/BulkUploadDialog';
import { useBulkModulePermission } from '../hooks/use.bulk.modulepermission';
export function BulkUploadModulePermissionDialog() {
  const state = useBulkModulePermission();
  return (
    <BulkUploadDialog
      open={state.open}
      onOpenChange={state.handleOpenChange}
      title="Bulk Upload Module Permission"
      description="Upload CSV/XLSX/XLS"
      rules={state.rules}
      template={state.template}
      templateRows={state.templateRows}
      file={state.file}
      fileInputRef={state.fileInputRef}
      previewResult={state.previewResult}
      previewLoading={state.previewMutation.isPending}
      importLoading={state.importMutation.isPending}
      onFileChange={state.handleFileChange}
      onPreview={state.handlePreview}
      onImport={state.handleImport}
      importLabel="Import Module Permission"
    />
  );
}
