import type { AccessScope } from '../../types/access-control.types';
import { Role, RoleFormValues } from '../types/role.types';
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
