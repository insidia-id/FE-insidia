import type { Permission } from '../../permission/types/permission.types';

export type ModulePermission = {
  id: string;
  module: string;
  description: string | null;
  createdAt: string;
  permissions: Permission[];
};

export type ModulePermissionFormValues = {
  module: string;
  description: string;
};
