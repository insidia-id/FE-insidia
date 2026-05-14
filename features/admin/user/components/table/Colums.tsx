import { ColumnDef } from '@tanstack/react-table';
import { RoleUser, StatusUser, User } from '../../types/user.types';
import { ArrowUpDown, Eye, Pencil, MoreVertical, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUpdateUser } from '../../hooks/useUser';
import { canManageRole, formatDateTime, getAssignableRoleOptions, getScopeByRole, getStatusVariant, formatStatus, getUserRole, getUserScope, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../HelperUser';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
function RoleSelectCell({ currentUserRole, user, onChange, isLoading }: { currentUserRole?: string | null; user: User; onChange: (role: RoleUser) => void; isLoading: boolean }) {
  const currentRole = getUserRole(user);
  const currentRoleLabel = USER_ROLE_OPTIONS.find((option) => option.value === currentRole)?.label ?? currentRole;
  const assignableRoleOptions = getAssignableRoleOptions(currentUserRole);
  const canManageCurrentRole = canManageRole(currentUserRole, currentRole);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{currentRoleLabel}</Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isLoading || !canManageCurrentRole || assignableRoleOptions.length === 0}>
            <MoreVertical className="size-4" />
            <span className="sr-only">Buka menu role</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {assignableRoleOptions.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)} className={option.value === currentRole ? 'font-semibold' : ''}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function StatusSelectCell({ user, onChange, isLoading }: { user: User; onChange: (status: StatusUser) => void; isLoading: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant(user.status)}>{formatStatus(user.status)}</Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" disabled={isLoading}>
            <MoreVertical className="size-4" />
            <span className="sr-only">Buka menu status</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {USER_STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)}>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
type UseUserColumnsProps = {
  currentUserRole?: string | null;
  setSelectedUserId: (id: string | null) => void;
  setSelectedUserScope: (scope: 'PLATFORM' | 'MITRA') => void;
  setIsDeleteOpen: (open: boolean) => void;
};
export const useUserColumns = ({ currentUserRole, setSelectedUserId, setSelectedUserScope, setIsDeleteOpen }: UseUserColumnsProps) => {
  const updateUserMutation = useUpdateUser();

  return useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Nama
            <ArrowUpDown className="size-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="min-w-[180px]">
              <p className="font-medium text-foreground">{user.name || '-'}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          );
        },
      },

      {
        id: 'role',
        accessorFn: (user) => getUserRole(user),
        cell: ({ row }) => (
          <RoleSelectCell
            currentUserRole={currentUserRole}
            user={row.original}
            onChange={(role) =>
              updateUserMutation.mutate({
                userId: row.original.id,
                data: { role, scope: getScopeByRole(role) },
              })
            }
            isLoading={updateUserMutation.isPending}
          />
        ),
      },
      {
        accessorKey: 'status',
        cell: ({ row }) => (
          <StatusSelectCell
            user={row.original}
            onChange={(status) =>
              updateUserMutation.mutate({
                userId: row.original.id,
                data: { status },
              })
            }
            isLoading={updateUserMutation.isPending}
          />
        ),
      },

      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Dibuat
            <ArrowUpDown className="size-4" />
          </Button>
        ),
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Buka menu aksi</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${user.id}?scope=${getUserScope(user)}`} className="flex items-center gap-2">
                      <Eye className="size-4" />
                      Detail
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/admin/users/${user.id}/edit?scope=${getUserScope(user)}`} className="flex items-center gap-2">
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {user.deletedAt === null && (
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setSelectedUserScope(getUserScope(user));
                        setIsDeleteOpen(true);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="size-4" />
                      Hapus User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [currentUserRole, setIsDeleteOpen, setSelectedUserId, setSelectedUserScope, updateUserMutation],
  );
};
