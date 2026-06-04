'use client';

import { BulkUploadDialog } from '@/features/bulk/components/BulkUploadDialog';
import type { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserScope } from '../types/user.types';
import { useBulkUploadUserDialog } from '../hooks/useBulkUploadUserDialog';
type UseBulkUploadUserDialogProps = {
  currentProfile: AuthProfileResponse;
  scope: UserScope;
};
export function BulkUploadUserDialog(props: UseBulkUploadUserDialogProps) {
  const state = useBulkUploadUserDialog(props);

  return (
    <BulkUploadDialog
      open={state.open}
      onOpenChange={state.handleOpenChange}
      title="Bulk Upload User"
      description="Upload CSV/XLSX/XLS"
      rules={state.rules}
      file={state.file}
      fileInputRef={state.fileInputRef}
      previewResult={state.previewResult}
      previewLoading={state.previewMutation.isPending}
      importLoading={state.importMutation.isPending}
      onFileChange={state.handleFileChange}
      onPreview={state.handlePreview}
      onImport={state.handleImport}
      template={state.template}
      templateRows={state.templateRows}
      importLabel="Import User"
    />
  );
}
