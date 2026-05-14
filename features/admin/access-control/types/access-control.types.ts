export type AccessScope = 'PLATFORM' | 'MITRA';

export type Permission = {
  id: string;
  name: string;
  code: string;
  scope: AccessScope;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RolePermission = {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
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
  permissions: RolePermission[];
  _count: {
    permissions: number;
    platformUsers: number;
    mitraUsers: number;
  };
};
