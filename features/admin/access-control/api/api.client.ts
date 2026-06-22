import { apiFetchInternal } from '@/lib/api/express.client';
import type { RolePermission } from '../types/access-control.types';
import type { AccessScope } from '../types/access-control.types';

export async function replaceRolePermissions(
  roleId: string,
  permissionIds: string[],
  scope: AccessScope,
): Promise<RolePermission[]> {
  const params = new URLSearchParams({ scope });
  const path = `/api/admin/roles/${roleId}/permissions?${params.toString()}`;

  return apiFetchInternal<RolePermission[]>(path, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}
