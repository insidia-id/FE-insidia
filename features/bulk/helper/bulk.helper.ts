import { BulkPreviewResult } from '../types/bulk.types';
export function groupWarnings(warningRows: BulkPreviewResult['warningRows']) {
  const grouped = new Map<string, number[]>();

  warningRows.forEach((row) => {
    row.warnings.forEach((warning) => {
      const rows = grouped.get(warning) ?? [];

      grouped.set(warning, [...rows, row.rowNumber]);
    });
  });

  return Array.from(grouped.entries()).map(([message, rows]) => ({
    message,
    rows,
  }));
}
export function groupErrors(failedRows: BulkPreviewResult['failedRows']) {
  const grouped = new Map<string, number[]>();
  failedRows.forEach((row) => {
    row.errors.forEach((error) => {
      const rows = grouped.get(error) ?? [];
      grouped.set(error, [...rows, row.rowNumber]);
    });
  });

  return Array.from(grouped.entries()).map(([message, rows]) => ({
    message,
    rows,
  }));
}
