'use client';

import { Download, FileSpreadsheet, Upload } from 'lucide-react';

import { LoadingButton } from '@/components/common/ButtonLoading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { fileAccept } from '../config/downloadExcelTemplate';
import { BulkPreviewResult } from './BulkPreviewResult';
import type { BulkUploadDialogProps } from '../types/bulk.types';
import { handleDownloadTemplateCsv, handleDownloadTemplateExcel } from '../config/downloadExcelTemplate';
export function BulkUploadDialog({
  open,
  onOpenChange,

  title,
  description,

  rules,

  file,
  fileInputRef,

  previewResult,

  previewLoading,
  importLoading,

  onFileChange,

  onPreview,
  onImport,
  template,
  templateRows,
  importLabel = 'Import',
}: BulkUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="size-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <section>
          <ul>
            {rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleDownloadTemplateCsv(template)} variant="outline">
              <Download className="size-4" />
              Unduh Template CSV
            </Button>

            <Button onClick={() => handleDownloadTemplateExcel(template, templateRows)} variant="outline">
              <Download className="size-4" />
              Unduh Template Excel
            </Button>
          </div>
        </section>

        <div>
          <Input ref={fileInputRef} type="file" accept={fileAccept} onChange={onFileChange} />

          {file?.name}
        </div>

        <BulkPreviewResult previewResult={previewResult} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>

          <LoadingButton isLoading={previewLoading} disabled={!file} onClick={onPreview}>
            Preview
          </LoadingButton>

          <LoadingButton isLoading={importLoading} disabled={!previewResult?.canImport} onClick={onImport}>
            {importLabel}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
