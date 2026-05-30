import { apiFetchInternal } from '@/lib/api/express.client';
import type { PermissionFormValues, RoleFormValues } from '../schema/access-control.schema';
import type { AccessScope, Permission, Role, RolePermission } from '../types/access-control.types';

function buildAccessControlParams(scope: AccessScope, includeDeleted?: boolean, mitraId?: string) {
  const params = new URLSearchParams({
    scope,
  });

  if (includeDeleted !== undefined) {
    params.set('includeDeleted', String(includeDeleted));
  }

  if (mitraId) {
    params.set('mitraId', mitraId);
  }

  return params;
}

export async function getRoles(scope: AccessScope, includeDeleted = false, mitraId?: string): Promise<Role[]> {
  const params = buildAccessControlParams(scope, includeDeleted, mitraId);
  const path = mitraId ? `/api/mitras/${mitraId}/roles` : '/api/admin/roles';

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

export async function replaceRolePermissions(roleId: string, permissionIds: string[], mitraId?: string): Promise<RolePermission[]> {
  const path = mitraId ? `/api/mitras/${mitraId}/roles/${roleId}/permissions` : `/api/admin/roles/${roleId}/permissions`;

  return apiFetchInternal<RolePermission[]>(path, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}

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
