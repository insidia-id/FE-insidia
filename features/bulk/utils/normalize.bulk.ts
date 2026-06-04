import { asBoolean, asNumberOrDefault, asRecord, asString, unwrapDataPayload, normalizeEnum } from '@/lib/helper/normalizer.helper';
import { BulkImportResult, BulkPreviewResult } from '../types/bulk.types';
export function normalizeBulkPreviewResult(value: unknown): BulkPreviewResult {
  const record = asRecord(unwrapDataPayload(value));

  if (!record) {
    throw new Error('Invalid bulk user preview data');
  }

  return {
    jobId: asString(record.jobId),
    totalRows: asNumberOrDefault(record.totalRows),
    validRows: asNumberOrDefault(record.validRows),
    invalidRows: asNumberOrDefault(record.invalidRows),
    canImport: asBoolean(record.canImport),
    failedRows: Array.isArray(record.failedRows)
      ? record.failedRows.map((row) => ({
          rowNumber: asNumberOrDefault(row.rowNumber),
          errors: Array.isArray(row.errors) ? row.errors.map(asString) : [],
        }))
      : [],
    warningRows: Array.isArray(record.warningsRows)
      ? record.warningsRows.map((row) => ({
          rowNumber: asNumberOrDefault(row.rowNumber),
          warnings: Array.isArray(row.warnings) ? row.warnings.map(asString) : [],
        }))
      : [],
  };
}

export function normalizeBulkImportResult(value: unknown): BulkImportResult {
  const record = asRecord(unwrapDataPayload(value));

  if (!record) {
    throw new Error('Invalid bulk user import data');
  }

  return {
    jobId: asString(record.jobId),
    status: asString(record.status),
  };
}
