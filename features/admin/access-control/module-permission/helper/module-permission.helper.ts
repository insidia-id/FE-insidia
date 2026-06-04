import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';

export function buildModulePermissionDefaultValues(modulePermission?: ModulePermission | null): ModulePermissionFormValues {
  if (!modulePermission) {
    return {
      module: '',
      scope: 'INSIDIA',
      description: '',
    };
  }

  return {
    module: modulePermission.module,
    scope: modulePermission.scope,
    description: modulePermission.description ?? '',
  };
}
