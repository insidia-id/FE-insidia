import type { Permission } from '../../permission/types/permission.types';
import { AccessScope } from '@/lib/types/types';
export type ModulePermission = {
  id: string;
  module: string;
  description: string | null;
  scope: AccessScope;
  createdAt: string;
  permissions: Permission[];
};

export type ModulePermissionFormValues = {
  module: string;
  description: string;
  scope: AccessScope;
};
