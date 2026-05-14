import { apiFetchInternal } from '@/lib/api/express.client';
import type { PermissionFormValues, RoleFormValues } from '../schema/access-control.schema';
import type { AccessScope, Permission, Role, RolePermission } from '../types/access-control.types';

export async function getRoles(scope: AccessScope, includeDeleted = false): Promise<Role[]> {
  const params = new URLSearchParams({
    scope,
    includeDeleted: String(includeDeleted),
  });

  return apiFetchInternal<Role[]>(`/api/admin/roles?${params.toString()}`, {
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

export async function replaceRolePermissions(roleId: string, permissionIds: string[]): Promise<RolePermission[]> {
  return apiFetchInternal<RolePermission[]>(`/api/admin/roles/${roleId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissionIds }),
  });
}

export async function getPermissions(scope: AccessScope): Promise<Permission[]> {
  const params = new URLSearchParams({
    scope,
  });

  return apiFetchInternal<Permission[]>(`/api/admin/permissions?${params.toString()}`, {
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
