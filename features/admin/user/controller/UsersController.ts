import { useMemo, useState } from 'react';
import { useGetUsers } from '../hooks/useUser';
import { filterUsersByManageableRoles, filterUsersByManageableScopes, getCurrentUserScope } from '../HelperUser';
import type { UserFilter, UserScope } from '../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

export function UsersController(currentProfile: AuthProfileResponse) {
  const currentUserRole = currentProfile?.mitraRoles?.roleCode ?? currentProfile?.insidiaRole ?? null;
  const [filter, setFilter] = useState<UserFilter>('available');
  const [scope, setScope] = useState<UserScope>(() => getCurrentUserScope(currentUserRole));
  const { data: users = [], isLoading, isError, error } = useGetUsers(filter, scope, currentProfile.mitraRoles?.mitraId);

  const visibleUsers = useMemo(() => {
    const byScope = filterUsersByManageableScopes(users, currentProfile, scope);

    return filterUsersByManageableRoles(byScope, currentUserRole, scope);
  }, [users, currentProfile, currentUserRole, scope]);

  return {
    filter,
    scope,
    visibleUsers,
    isLoading,
    isError,
    error,
    onFilterChange: setFilter,
    onScopeChange: setScope,
  };
}
