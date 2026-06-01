import { apiFetchInternal } from '@/lib/api/express.client';
import type { AccessScope } from '../../types/access-control.types';
import { buildAccessControlParams } from '../../lib/access-control.helper';
import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';

export async function getModulePermissions(scope: AccessScope, mitraId?: string): Promise<ModulePermission[]> {
  const params = buildAccessControlParams(scope, undefined, mitraId);
  const path = '/api/admin/permissions/modules';
  console.log('Fetching module permissions with params:', params.toString());
  const response = await apiFetchInternal<ModulePermission[]>(`${path}?${params.toString()}`, {
    method: 'GET',
  });
  console.log('Fetched module permissions:', response);
  return response || [];
}

export async function createModulePermission(data: ModulePermissionFormValues): Promise<ModulePermission> {
  return apiFetchInternal<ModulePermission>('/api/admin/permissions/modules', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateModulePermission(modulePermissionId: string, data: ModulePermissionFormValues): Promise<ModulePermission> {
  console.log('Updating module permission with ID:', modulePermissionId, 'and data:', data);
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
