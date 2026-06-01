import { AccessScope } from '../../types/access-control.types';
import { Permission, PermissionFormValues } from '../types/permission.types';
export function buildPermissionDefaultValues(scope: AccessScope, permission?: Permission | null): PermissionFormValues {
  if (!permission) {
    return {
      moduleId: '',
      name: '',
      scope,
      code: '',
      description: '',
    };
  }

  return {
    moduleId: permission.moduleId ?? '',
    name: permission.name,
    scope: permission.scope,
    code: permission.code,
    description: permission.description ?? '',
  };
}
