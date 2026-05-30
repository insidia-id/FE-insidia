import { useState } from 'react';
import { useUpdateUser } from '../hooks/useUser';
import { getScopeByRole, getUserScope } from '../HelperUser';
import { useUserColumns } from '../components/table/Colums';
import { useUserDataTable } from '../components/table/DataTable';
import type { User, UserScope } from '../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

type UserTableControllerProps = {
  currentProfile: AuthProfileResponse;
  users: User[];
  scope: UserScope;
};

export function UserTableController({ currentProfile, users, scope }: UserTableControllerProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScope, setSelectedUserScope] = useState<UserScope>('INSIDIA');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const updateUserMutation = useUpdateUser();

  const columns = useUserColumns({
    currentProfile,
    scope,
    isUpdating: updateUserMutation.isPending,
    onDeleteRequest: (user) => {
      setSelectedUserId(user.id);
      setSelectedUserScope(scope);
      setIsDeleteOpen(true);
    },
    onRoleChange: (userId, role) => {
      updateUserMutation.mutate({
        userId,
        data: {
          role,
          scope: scope,
        },
      });
    },
    onStatusChange: (userId, status) => {
      updateUserMutation.mutate({
        userId,
        data: { status },
      });
    },
  });

  const table = useUserDataTable({
    users,
    columns,
    scope,
    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
  });

  return {
    columns,
    globalFilter,
    isDeleteOpen,
    selectedUserId,
    selectedUserScope,
    table,
    onDeleteDialogChange: (open: boolean) => {
      setIsDeleteOpen(open);

      if (open) {
        return;
      }

      setSelectedUserId(null);
      setSelectedUserScope('INSIDIA');
    },
    onDeleteSuccess: () => {
      setSelectedUserId(null);
      setSelectedUserScope('INSIDIA');
      setIsDeleteOpen(false);
    },
    onGlobalFilterChange: setGlobalFilter,
  };
}
