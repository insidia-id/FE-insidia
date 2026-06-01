export type AccessScope = 'INSIDIA' | 'MITRA';
import type { Permission } from '../permission/types/permission.types';

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
};
