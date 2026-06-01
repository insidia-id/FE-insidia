import { apiFetchInternal } from '@/lib/api/express.client';
import type { RolePermission } from '../types/access-control.types';

export async function replaceRolePermissions(roleId: string, permissionIds: string[], mitraId?: string): Promise<RolePermission[]> {
  const path = mitraId ? `/api/mitras/${mitraId}/roles/${roleId}/permissions` : `/api/admin/roles/${roleId}/permissions`;

  return apiFetchInternal<RolePermission[]>(path, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}
