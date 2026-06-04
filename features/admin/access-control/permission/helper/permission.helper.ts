import { AccessScope } from '../../types/access-control.types';
import { Permission, PermissionFormValues } from '../types/permission.types';
export function buildPermissionDefaultValues(permission?: Permission | null): PermissionFormValues {
  if (!permission) {
    return {
      moduleId: '',
      name: '',
      code: '',
      description: '',
    };
  }

  return {
    moduleId: permission.moduleId ?? '',
    name: permission.name,
    code: permission.code,
    description: permission.description ?? '',
  };
}
