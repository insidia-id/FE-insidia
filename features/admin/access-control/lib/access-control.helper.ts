import type { AccessScope } from '../types/access-control.types';
import { Role } from '../roles/types/role.types';
import { Permission } from '../permission/types/permission.types';
export function buildAccessControlParams(scope: AccessScope, includeDeleted?: boolean, mitraId?: string) {
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
export const ACCESS_SCOPE_OPTIONS: Array<{
  label: string;
  value: AccessScope;
}> = [
  { label: 'Insidia', value: 'INSIDIA' },
  { label: 'Mitra', value: 'MITRA' },
];
export function getAssignableRoleOptions(userRole: string) {
  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return ACCESS_SCOPE_OPTIONS;
  }

  return ACCESS_SCOPE_OPTIONS.filter((option) => option.value === 'MITRA');
}

export function getRoleStatus(role: Role) {
  if (role.deletedAt) {
    return { label: 'Terhapus', variant: 'outline' as const };
  }

  if (role.isSystem) {
    return { label: 'Sistem', variant: 'default' as const };
  }

  return { label: 'Kustom', variant: 'secondary' as const };
}

export function resolveSelectedRoleId(roles: Role[], activeRoleId: string | null) {
  if (activeRoleId && roles.some((role) => role.id === activeRoleId)) {
    return activeRoleId;
  }

  return roles[0]?.id ?? null;
}

export function resolveSelectedRole(roles: Role[], selectedRoleId: string | null) {
  return roles.find((role) => role.id === selectedRoleId) ?? null;
}

export function resolveSelectedPermissionIds(params: {
  selectedRole: Role | null;
  selectedRoleId: string | null;
  permissionDraft: {
    roleId: string | null;
    permissionIds: string[];
  };
}) {
  const { permissionDraft, selectedRole, selectedRoleId } = params;

  if (permissionDraft.roleId === selectedRoleId) {
    return permissionDraft.permissionIds;
  }

  return selectedRole?.permissions.map((item) => item.permissionId) ?? [];
}

export function filterPermissionsByScope(permissions: Permission[], scope: AccessScope) {
  return permissions.filter((permission) => permission.scope === scope);
}
