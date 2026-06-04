import { apiFetchInternal } from '@/lib/api/express.client';
import type { AccessScope } from '../../types/access-control.types';
import { buildAccessControlParams } from '../../lib/access-control.helper';
import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';
import { normalizeBulkImportResult, normalizeBulkPreviewResult } from '@/features/bulk/utils/normalize.bulk';
import { BulkPreviewResult, BulkImportResult } from '@/features/bulk/types/bulk.types';
export async function getModulePermissions(scope: AccessScope, mitraId?: string): Promise<ModulePermission[]> {
  const params = buildAccessControlParams(scope, undefined, mitraId);
  const path = '/api/admin/permissions/modules';
  const response = await apiFetchInternal<ModulePermission[]>(`${path}?${params.toString()}`, {
    method: 'GET',
  });
  return response || [];
}

export async function createModulePermission(data: ModulePermissionFormValues): Promise<ModulePermission> {
  return apiFetchInternal<ModulePermission>('/api/admin/permissions/modules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateModulePermission(modulePermissionId: string, data: ModulePermissionFormValues): Promise<ModulePermission> {
  return apiFetchInternal<ModulePermission>(`/api/admin/permissions/modules/${modulePermissionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteModulePermission(modulePermissionId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/permissions/modules/${modulePermissionId}`, {
    method: 'DELETE',
  });
}
export async function previewBulkModulesPermission(file: File): Promise<BulkPreviewResult> {
  const formData = new FormData();
  formData.set('file', file);

  const res = await apiFetchInternal<unknown>('/api/admin/permissions/modules/preview', {
    method: 'POST',
    body: formData,
  });
  console.log('Preview bulk modules permission response:', res);
  const normalizedResult = normalizeBulkPreviewResult(res);
  console.log('Normalized preview result:', normalizedResult);
  return normalizedResult;
}

export async function importBulkModulesPermission(jobId: string): Promise<BulkImportResult> {
  const res = await apiFetchInternal<unknown>(`/api/admin/permissions/modules/import/${jobId}`, {
    method: 'POST',
  });
  return normalizeBulkImportResult(res);
}
