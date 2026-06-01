import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { downloadExcelTemplate, type ExcelTemplateRow } from '../lib/downloadExcelTemplate';
import { useImportBulkUsers, usePreviewBulkUsers } from './useUser';
import type { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserScope } from '../types/user.types';

type UseBulkUploadUserDialogProps = {
  currentProfile: AuthProfileResponse;
  scope: UserScope;
};

type CsvTemplateContext = {
  fileName: string;
  content: string;
};

const fileAccept = '.csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

export function useBulkUploadUserDialog({ currentProfile, scope }: UseBulkUploadUserDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const previewMutation = usePreviewBulkUsers();
  const importMutation = useImportBulkUsers();
  const resetPreview = previewMutation.reset;
  const resetImport = importMutation.reset;

  const isAkademikMitraContext = scope === 'MITRA' && currentProfile.mitraRoles?.roleCode === 'AKADEMIK';

  const template = useMemo<CsvTemplateContext>(() => {
    if (scope === 'MITRA') {
      if (isAkademikMitraContext) {
        return {
          fileName: 'template-bulk-user-mitra-akademik.csv',
          content: ['email,name,phone,mitraRole,status', 'murid1@example.com,Murid Satu,081234567890,MURID,ACTIVE', 'guru1@example.com,Guru Satu,081234567891,GURU,ACTIVE'].join('\n'),
        };
      }

      return {
        fileName: 'template-bulk-user-mitra.csv',
        content: [
          'email,name,phone,scope,role,mitraRole,mitraId,status',
          'murid1@example.com,Murid Satu,081234567890,MITRA,USER,MURID,isi-mitra-id,ACTIVE',
          'guru1@example.com,Guru Satu,081234567891,MITRA,USER,GURU,isi-mitra-id,ACTIVE',
        ].join('\n'),
      };
    }

    return {
      fileName: 'template-bulk-user-insidia.csv',
      content: ['email,name,phone,scope,role,status', 'mentor1@example.com,Mentor Satu,081234567892,INSIDIA,MENTOR,ACTIVE', 'user1@example.com,User Satu,081234567893,INSIDIA,USER,ACTIVE'].join('\n'),
    };
  }, [isAkademikMitraContext, scope]);

  const templateRows = useMemo<ExcelTemplateRow[]>(() => {
    if (scope === 'MITRA') {
      if (isAkademikMitraContext) {
        return [
          { email: 'murid1@example.com', name: 'Murid Satu', phone: '081234567890', mitraRole: 'MURID', status: 'ACTIVE' },
          { email: 'guru1@example.com', name: 'Guru Satu', phone: '081234567891', mitraRole: 'GURU', status: 'ACTIVE' },
        ];
      }

      return [
        { email: 'murid1@example.com', name: 'Murid Satu', phone: '081234567890', scope: 'MITRA', role: 'USER', mitraRole: 'MURID', status: 'ACTIVE' },
        { email: 'guru1@example.com', name: 'Guru Satu', phone: '081234567891', scope: 'MITRA', role: 'USER', mitraRole: 'GURU', status: 'ACTIVE' },
      ];
    }

    return [
      { email: 'mentor1@example.com', name: 'Mentor Satu', phone: '081234567892', scope: 'INSIDIA', role: 'MENTOR', status: 'ACTIVE' },
      { email: 'user1@example.com', name: 'User Satu', phone: '081234567893', scope: 'INSIDIA', role: 'USER', status: 'ACTIVE' },
    ];
  }, [isAkademikMitraContext, scope]);

  useEffect(() => {
    resetPreview();
  }, [resetPreview, scope]);

  const rules = useMemo(() => {
    const fileRules = ['Format file yang didukung: `CSV`, `XLSX`, dan `XLS`.', 'Template tersedia dalam format CSV dan Excel.'];

    if (scope === 'MITRA') {
      if (isAkademikMitraContext) {
        return [...fileRules, 'Kolom minimum: `email`, `mitraRole`, dan `status`. `name` dan `phone` opsional.'];
      }

      return [
        ...fileRules,
        'Kolom minimum: `email`, `scope`, `role`, `mitraRole`, `mitraId`, dan `status`.',
        'Untuk user mitra, isi `scope` dengan `MITRA` dan `role` dengan `USER`.',
        'Isi `mitraRole` dengan salah satu: `AKADEMIK`, `GURU`, `MURID`, atau `WALI_MURID`.',
      ];
    }

    return [
      ...fileRules,
      'Kolom minimum: `email`, `scope`, `role`, dan `status`. `name` dan `phone` opsional.',
      'Untuk user Insidia, isi `scope` dengan `INSIDIA`.',
      'Isi `role` dengan salah satu role Insidia yang diizinkan, misalnya `USER` atau `MENTOR`.',
    ];
  }, [isAkademikMitraContext, scope]);

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
    fileAccept,
    fileInputRef,
    importMutation,
    previewMutation,
    previewResult,
    rules,
    handleDownloadTemplateCsv,
    handleDownloadTemplateExcel,
    handleFileChange,
    handleImport,
    handleOpenChange,
    handlePreview,
  };
}
