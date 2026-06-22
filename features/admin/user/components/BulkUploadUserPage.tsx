'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import { Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { getBulkUserTemplate } from '@/features/bulk/config/bulk.template';
import type { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserScope } from '../types/user.types';
import { formatRole, getActiveMitraContext, getUsersHref, normalizeRoleQueryParam, normalizeScopeQueryParam } from '../HelperUser';
import { BulkPreviewResult } from '@/features/bulk/components/BulkPreviewResult';
import { handleDownloadTemplateCsv, handleDownloadTemplateExcel } from '@/features/bulk/config/downloadExcelTemplate';
import { useImportBulkUsers, usePreviewBulkUsers } from '../hooks/useUser';

type BulkUploadUserPageProps = {
  currentProfile: AuthProfileResponse;
  defaultScope?: string;
  defaultRoleCode?: string;
};

export function BulkUploadUserPage({ currentProfile, defaultScope, defaultRoleCode }: BulkUploadUserPageProps) {
  const { activeMitraRole, activeMitraSlug } = getActiveMitraContext(currentProfile);
  const scope: UserScope = normalizeScopeQueryParam(defaultScope) ?? 'INSIDIA';
  const roleCode = normalizeRoleQueryParam(defaultRoleCode);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const previewMutation = usePreviewBulkUsers();
  const importMutation = useImportBulkUsers();
  const bulkConfig = getBulkUserTemplate(scope, scope === 'MITRA' && activeMitraRole === 'AKADEMIK');
  const previewResult = previewMutation.data;
  const title = roleCode ? `Bulk Upload ${formatRole(roleCode)}` : 'Bulk Upload User';
  const description = roleCode ? `Upload file untuk menambahkan user ${formatRole(roleCode).toLowerCase()} secara massal.` : 'Upload file CSV atau Excel untuk menambahkan user secara massal.';
  const { rules, template, templateRows } = bulkConfig;

  useEffect(() => {
    previewMutation.reset();
  }, [previewMutation, scope]);

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

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen User</p>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Unduh template yang sesuai, isi data user, lalu unggah kembali file untuk dipreview sebelum import.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => handleDownloadTemplateCsv(template)} type="button" variant="outline">
                  <Download className="size-4" />
                  Unduh Template CSV
                </Button>
                <Button onClick={() => handleDownloadTemplateExcel(template, templateRows)} type="button" variant="outline">
                  <Download className="size-4" />
                  Unduh Template Excel
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
              <p className="text-sm text-muted-foreground">{file?.name ?? 'Belum ada file yang dipilih.'}</p>
            </div>

            <BulkPreviewResult previewResult={previewResult} />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button asChild type="button" variant="outline">
                <Link href={getUsersHref(activeMitraSlug, 'users')}>Kembali ke daftar user</Link>
              </Button>
              <LoadingButton isLoading={previewMutation.isPending} disabled={!file} onClick={handlePreview} type="button">
                <Upload className="size-4" />
                Preview
              </LoadingButton>
              <LoadingButton isLoading={importMutation.isPending} disabled={!previewResult?.canImport} onClick={handleImport} type="button">
                Import User
              </LoadingButton>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
