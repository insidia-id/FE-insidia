import { apiFetchInternal } from '@/lib/api/express.client';
import type { PermissionFormValues, Permission } from '../types/permission.types';
import type { AccessScope } from '../../types/access-control.types';
import { buildAccessControlParams } from '../../lib/access-control.helper';
export async function getPermissions(scope: AccessScope, mitraId?: string): Promise<Permission[]> {
  const params = buildAccessControlParams(scope, undefined, mitraId);
  const path = mitraId ? `/api/mitras/${mitraId}/permissions` : '/api/admin/permissions';

  return apiFetchInternal<Permission[]>(`${path}?${params.toString()}`, {
    method: 'GET',
  });
}

export async function createPermission(data: PermissionFormValues): Promise<Permission> {
  return apiFetchInternal<Permission>('/api/admin/permissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePermission(permissionId: string, data: PermissionFormValues): Promise<Permission> {
  console.log('Updating permission with ID:', permissionId, 'and data:', data);
  return apiFetchInternal<Permission>(`/api/admin/permissions/${permissionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePermission(permissionId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/permissions/${permissionId}`, {
    method: 'DELETE',
  });
}
