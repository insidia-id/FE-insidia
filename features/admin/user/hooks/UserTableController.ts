import { useState } from 'react';
import { useUpdateUser } from '../hooks/useUser';
import { useUserColumns } from '../components/table/Colums';
import { useUserDataTable } from '../components/table/DataTable';
import type { User, UserScope } from '../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserTableColumnId } from '../config/user-page.config';
import { OnChangeFn, PaginationState } from '@tanstack/react-table';

type UserTableControllerProps = {
  currentProfile: AuthProfileResponse;
  users: User[];
  scope: UserScope;
  columnIds: UserTableColumnId[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  total: number;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
};

export function UserTableController({ currentProfile, users, scope, columnIds, globalFilter, onGlobalFilterChange, total, setPagination, pagination }: UserTableControllerProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScope, setSelectedUserScope] = useState<UserScope>('INSIDIA');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const updateUserMutation = useUpdateUser();

  const columns = useUserColumns({
    currentProfile,
    scope,
    columnIds,
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
    onGlobalFilterChange,
    pagination,
    onPaginationChange: setPagination,
    total,
  });

  return {
    columns,
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
  };
}
