import type { AccessScope, RolePermission } from '../../types/access-control.types';
export type RoleFormValues = {
  name: string;
  code: string;
  scope: 'INSIDIA' | 'MITRA';
  description: string;
  isSystem: boolean;
};
export type Role = {
  id: string;
  name: string;
  code: string;
  scope: AccessScope;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count: {
    insidiaUsers: number;
    mitraUsers: number;
    mitraRolePermissions: number;
    permissions: number;
  };
};
