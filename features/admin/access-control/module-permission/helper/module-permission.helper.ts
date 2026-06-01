import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';

export function buildModulePermissionDefaultValues(modulePermission?: ModulePermission | null): ModulePermissionFormValues {
  if (!modulePermission) {
    return {
      module: '',
      description: '',
    };
  }

  return {
    module: modulePermission.module,
    description: modulePermission.description ?? '',
  };
}
