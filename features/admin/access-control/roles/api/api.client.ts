import { apiFetchInternal } from '@/lib/api/express.client';
import type { AccessScope } from '../../types/access-control.types';
import { buildAccessControlParams } from '../../lib/access-control.helper';
import { Role, RoleFormValues } from '../types/role.types';
export async function getRoles(scope: AccessScope, includeDeleted = false): Promise<Role[]> {
  const params = buildAccessControlParams(scope, includeDeleted);
  const path = '/api/admin/roles';

  return apiFetchInternal<Role[]>(`${path}?${params.toString()}`, {
    method: 'GET',
  });
}

export async function createRole(data: RoleFormValues): Promise<Role> {
  return apiFetchInternal<Role>('/api/admin/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRole(roleId: string, data: RoleFormValues): Promise<Role> {
  return apiFetchInternal<Role>(`/api/admin/roles/${roleId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteRole(roleId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(`/api/admin/roles/${roleId}`, {
    method: 'DELETE',
  });
}
