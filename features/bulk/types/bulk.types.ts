export type BulkPreviewResult = {
  jobId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  canImport: boolean;
  warningRows: Array<{
    rowNumber: number;
    warnings: string[];
  }>;
  failedRows: Array<{
    rowNumber: number;
    errors: string[];
  }>;
};

export type BulkImportResult = {
  jobId: string;
  status: string;
};
export interface CsvTemplateContext {
  fileName: string;
  content: string;
}

export type ExcelTemplateRow = Record<string, string | number | null>;

export interface BulkTemplateConfig {
  template: CsvTemplateContext;
  templateRows: ExcelTemplateRow[];
  rules: string[];
}
export type BulkUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  rules: string[];

  file?: File | null;

  fileInputRef: React.RefObject<HTMLInputElement | null>;

  previewResult?: BulkPreviewResult;

  previewLoading?: boolean;
  importLoading?: boolean;

  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onPreview: () => void;
  onImport: () => void;
  template: CsvTemplateContext;
  templateRows: ExcelTemplateRow[];

  importLabel?: string;
};
