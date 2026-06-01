'use client';

import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useBulkUploadUserDialog } from '../hooks/useBulkUploadUserDialog';
import type { UserScope } from '../types/user.types';
import type { AuthProfileResponse } from '@/features/auth/types/auth.types';

type BulkUploadUserDialogProps = {
  currentProfile: AuthProfileResponse;
  scope: UserScope;
};

export function BulkUploadUserDialog({ currentProfile, scope }: BulkUploadUserDialogProps) {
  const { open, file, fileAccept, fileInputRef, importMutation, previewMutation, previewResult, rules, handleDownloadTemplateCsv, handleDownloadTemplateExcel, handleFileChange, handleImport, handleOpenChange, handlePreview } =
    useBulkUploadUserDialog({ currentProfile, scope });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <Upload className="size-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 sm:max-w-3xl">
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="border-b border-border/60 bg-muted/20 px-6 py-5">
            <DialogHeader>
              <DialogTitle>Bulk Upload User</DialogTitle>
              <DialogDescription>Upload file CSV, XLSX, atau XLS untuk preview validasi terlebih dahulu, lalu lanjutkan import jika seluruh baris sudah valid.</DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
              {['Unduh template CSV/Excel', 'Unggah file CSV/XLSX/XLS', 'Preview & import'].map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-lg border border-border/60 bg-white/80 p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{index + 1}</span>
                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            <section className="rounded-xl border border-border/60 bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FileSpreadsheet className="size-4 text-muted-foreground" />
                    Aturan File
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" onClick={handleDownloadTemplateCsv}>
                    <Download className="size-4" />
                    Unduh Template CSV
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDownloadTemplateExcel}>
                    <Download className="size-4" />
                    Unduh Template Excel
                  </Button>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="bulk-user-file">
                  File CSV/XLSX/XLS
                </label>
                <div className="rounded-xl border border-dashed border-border/70 bg-white p-4">
                  <Input id="bulk-user-file" ref={fileInputRef} accept={fileAccept} type="file" onChange={handleFileChange} />
                  <div className="mt-3 text-sm text-muted-foreground">
                    {file ? (
                      <span>
                        File terpilih: <strong className="text-foreground">{file.name}</strong>
                      </span>
                    ) : (
                      'Pilih file `.csv`, `.xlsx`, atau `.xls` untuk memulai preview bulk upload.'
                    )}
                  </div>
                </div>
              </div>

              {previewResult && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">Hasil Preview</p>
                    <div className="grid gap-3 md:grid-cols-4">
                      <PreviewStatCard label="Total baris" value={previewResult.totalRows} />
                      <PreviewStatCard label="Baris valid" value={previewResult.validRows} tone="success" />
                      <PreviewStatCard label="Baris invalid" value={previewResult.invalidRows} tone={previewResult.invalidRows > 0 ? 'danger' : 'default'} />
                      <PreviewStatCard label="Siap import" value={previewResult.canImport ? 'Ya' : 'Tidak'} tone={previewResult.canImport ? 'success' : 'danger'} />
                    </div>

                    {!previewResult.canImport && (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">Preview selesai, tetapi masih ada baris yang tidak valid. Perbaiki file lalu jalankan preview lagi.</div>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>

        <DialogFooter className=" ">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Tutup
            </Button>
          </DialogClose>
          <LoadingButton type="button" variant="outline" isLoading={previewMutation.isPending} disabled={!file} onClick={handlePreview}>
            Preview File
          </LoadingButton>
          <LoadingButton type="button" variant="insidia" isLoading={importMutation.isPending} disabled={!previewResult?.canImport} onClick={handleImport}>
            Import User
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreviewStatCard({ label, value, tone = 'default' }: { label: string; value: number | string; tone?: 'default' | 'success' | 'danger' }) {
  const toneClassName = tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : tone === 'danger' ? 'border-destructive/20 bg-destructive/5 text-destructive' : 'border-border bg-background text-foreground';

  return (
    <div className={`rounded-xl border p-4 ${toneClassName}`}>
      <p className="text-xs uppercase tracking-[0.14em] opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
