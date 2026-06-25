import { ChangeEvent, useRef, useState } from 'react';
import { getBulkUserTemplate } from '@/features/bulk/config/bulk.template';
import { useImportBulkUsers, usePreviewBulkUsers } from './useUser';
import { formatRole } from '../HelperUser';
import type { MitraRole, RoleUser } from '../types/user.types';
type BulkUploadUserPageProps = {
  scope: string;
  roleCode: RoleUser | undefined;
  activeMitraRole: MitraRole | null;
};
export const useUserBulkUpload = ({ scope, roleCode, activeMitraRole }: BulkUploadUserPageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const previewMutation = usePreviewBulkUsers();
  const importMutation = useImportBulkUsers();
  const bulkConfig = getBulkUserTemplate(scope, scope === 'MITRA' && activeMitraRole === 'AKADEMIK', roleCode as MitraRole | undefined);
  const previewResult = previewMutation.data;
  const title = roleCode ? `Bulk Upload ${formatRole(roleCode)}` : 'Bulk Upload User';
  const description = roleCode ? `Upload file untuk menambahkan user ${formatRole(roleCode).toLowerCase()} secara massal.` : 'Upload file CSV atau Excel untuk menambahkan user secara massal.';
  const { rules, template, templateRows } = bulkConfig;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    previewMutation.reset();
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
    setFile(null);
    previewMutation.reset();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return {
    fileInputRef,
    file,
    previewMutation,
    importMutation,
    previewResult,
    title,
    description,
    rules,
    template,
    templateRows,
    handleFileChange,
    handlePreview,
    handleImport,
  };
};
