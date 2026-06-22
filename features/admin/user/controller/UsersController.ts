import { useDeferredValue, useMemo, useState } from 'react';
import { useGetUsers } from '../hooks/useUser';
import { filterUsersByManageableScopes, getActiveMitraContext, getCurrentUserScope } from '../HelperUser';
import type { RoleUser, UserFilter, UserScope } from '../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserManagementPageConfig } from '../config/user-page.config';

export function UsersController(currentProfile: AuthProfileResponse, pageConfig: UserManagementPageConfig) {
  const { activeInsidiaRole, activeMitraRole } = getActiveMitraContext(currentProfile);
  const [filter, setFilter] = useState<UserFilter>('available');
  const [roleCode, setRoleCode] = useState<RoleUser>(pageConfig.roleCode ?? 'ALL');
  const [scope, setScope] = useState<UserScope>(pageConfig.scope ?? getCurrentUserScope(activeMitraRole ?? activeInsidiaRole));
  const [search, setSearch] = useState('');
  const resolvedScope = pageConfig.scope ?? scope;
  const resolvedRoleCode = pageConfig.roleCode ?? roleCode;
  const {
    data = { users: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useGetUsers({
    filter,
    scope: resolvedScope,
    roleCode: resolvedRoleCode,
  });

  const visibleUsers = useMemo(() => {
    return filterUsersByManageableScopes(data.users, currentProfile, resolvedScope);
  }, [data.users, currentProfile, resolvedScope]);

  return {
    filter,
    scope: resolvedScope,
    roleCode: resolvedRoleCode,
    search,
    visibleUsers,
    total: data.total,
    isLoading,
    isError,
    error,
    onFilterChange: setFilter,
    onScopeChange: (nextScope: UserScope) => {
      if (!pageConfig.allowScopeFilter) {
        return;
      }

      setScope(nextScope);
    },
    onRoleCodeChange: (nextRoleCode: RoleUser) => {
      if (!pageConfig.allowRoleFilter) {
        return;
      }

      setRoleCode(nextRoleCode);
    },
    onSearchChange: setSearch,
  };
}
