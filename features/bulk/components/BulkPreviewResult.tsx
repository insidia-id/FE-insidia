import { Separator } from '@/components/ui/separator';
import { BulkPreviewResult as PreviewResult } from '../types/bulk.types';
import { PreviewStatCard } from './PreviewStatCard';
import { groupErrors, groupWarnings } from '../helper/bulk.helper';
type Props = {
  previewResult?: PreviewResult;
};

export function BulkPreviewResult({ previewResult }: Props) {
  if (!previewResult) return null;
  const groupedWarnings = groupWarnings(previewResult.warningRows ?? []);
  const groupedErrors = groupErrors(previewResult.failedRows ?? []);
  return (
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
        {groupedWarnings.map((warning) => (
          <div key={warning.message} className="rounded border border-yellow-500/50 bg-yellow-50 text-yellow-800 p-3">
            <p className="font-medium">{warning.message}</p>

            <p className="text-sm text-muted-foreground">Baris: {warning.rows.join(', ')}</p>
          </div>
        ))}
        {groupedErrors.map((error) => (
          <div key={error.message} className="rounded border border-destructive/20 bg-destructive/5 text-destructive p-3">
            <p className="font-medium">{error.message}</p>
            <p className="text-sm text-muted-foreground">Baris: {error.rows.join(', ')}</p>
          </div>
        ))}
      </div>
    </>
  );
}
