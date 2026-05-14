import type { PermissionFormValues, RoleFormValues } from '../schema/access-control.schema';
import type { AccessScope, Permission, Role } from '../types/access-control.types';

export const ACCESS_SCOPE_OPTIONS: Array<{ label: string; value: AccessScope }> = [
  { label: 'Platform', value: 'PLATFORM' },
  { label: 'Mitra', value: 'MITRA' },
];

export function buildRoleDefaultValues(scope: AccessScope, role?: Role | null): RoleFormValues {
  if (!role) {
    return {
      name: '',
      code: '',
      scope,
      description: '',
      isSystem: false,
    };
  }

  return {
    name: role.name,
    code: role.code,
    scope: role.scope,
    description: role.description ?? '',
    isSystem: role.isSystem,
  };
}

export function buildPermissionDefaultValues(scope: AccessScope, permission?: Permission | null): PermissionFormValues {
  if (!permission) {
    return {
      name: '',
      scope,
      description: '',
    };
  }

  return {
    name: permission.name,
    scope: permission.scope,
    description: permission.description ?? '',
  };
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
