import { apiFetchInternal } from '@/lib/api/express.client';
import type { AccessScope, RolePermission } from '../../types/access-control.types';
import { buildAccessControlParams } from '../../lib/access-control.helper';
import { Role, RoleFormValues } from '../types/role.types';

function rolesPath(path?: string) {
  return `/api/admin/roles${path ? `/${path}` : ''}`;
}

export async function getRoles(scope: AccessScope, includeDeleted = false, mitraId?: string): Promise<Role[]> {
  const params = buildAccessControlParams(scope, includeDeleted, mitraId);

  const path = rolesPath();

  return apiFetchInternal<Role[]>(`${path}?${params.toString()}`, {
    method: 'GET',
  });
}

export async function createRole(data: RoleFormValues): Promise<Role> {
  return apiFetchInternal<Role>(rolesPath(), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateRole(roleId: string, data: RoleFormValues): Promise<Role> {
  return apiFetchInternal<Role>(rolesPath(`${roleId}`), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteRole(roleId: string): Promise<{ message: string }> {
  return apiFetchInternal<{ message: string }>(rolesPath(`${roleId}`), {
    method: 'DELETE',
  });
}

export async function getRolePermissions(roleId: string): Promise<RolePermission[]> {
  const path = rolesPath(`${roleId}/permissions`);
  return apiFetchInternal<RolePermission[]>(path, {
    method: 'GET',
  });
}

export async function replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<RolePermission[]> {
  const path = rolesPath(`${roleId}/permissions`);

  return apiFetchInternal<RolePermission[]>(path, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}

export async function getMitraRolePermissions(roleId: string, mitraId: string): Promise<RolePermission[]> {
  const path = rolesPath(`${roleId}/permissions/mitras/${mitraId}`);
  const res = await apiFetchInternal<RolePermission[]>(path, {
    method: 'GET',
  });
  return res;
}

export async function replaceMitraRolePermissions(roleId: string, permissionIds: string[], mitraId: string): Promise<RolePermission[]> {
  const path = rolesPath(`${roleId}/permissions/mitras/${mitraId}`);

  return apiFetchInternal<RolePermission[]>(path, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}
