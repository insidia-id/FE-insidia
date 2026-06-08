import { ColumnDef } from '@tanstack/react-table';
import { RoleUser, StatusUser, User, UserScope } from '../../types/user.types';
import { ArrowUpDown, Eye, Pencil, MoreVertical, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { canManageRole, formatDateTime, getAssignableRoleOptions, getStatusVariant, formatStatus, getUserRole, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS, getUsersHref } from '../../HelperUser';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

function RoleSelectCell({ currentUserRole, scope, user, onChange, isLoading }: { currentUserRole?: string | null; scope: UserScope; user: User; onChange: (role: RoleUser) => void; isLoading: boolean }) {
  const currentRole = getUserRole(user, scope);
  const currentRoleLabel = USER_ROLE_OPTIONS.find((option) => option.value === currentRole)?.label ?? currentRole;
  const assignableRoleOptions = getAssignableRoleOptions(currentUserRole, scope);
  const canManageCurrentRole = canManageRole(currentUserRole, currentRole, scope);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{currentRoleLabel}</Badge>

      {(currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && (
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
      )}
    </div>
  );
}

function StatusSelectCell({ currentUserRole, user, onChange, isLoading }: { currentUserRole?: string | null; user: User; onChange: (status: StatusUser) => void; isLoading: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant(user.status)}>{formatStatus(user.status)}</Badge>
      {(currentUserRole === 'SUPER_ADMIN' || currentUserRole === 'ADMIN') && (
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
      )}
    </div>
  );
}
type UseUserColumnsProps = {
  currentProfile: AuthProfileResponse;
  scope: UserScope;
  isUpdating: boolean;
  onDeleteRequest: (user: User) => void;
  onRoleChange: (userId: string, role: RoleUser) => void;
  onStatusChange: (userId: string, status: StatusUser) => void;
};
export const useUserColumns = ({ currentProfile, scope, isUpdating, onDeleteRequest, onRoleChange, onStatusChange }: UseUserColumnsProps) => {
  const currentUserRole = currentProfile.mitraRoles?.roleCode ?? currentProfile.insidiaRole ?? null;
  const mitraSlug = currentProfile.mitraRoles?.mitraSlug ?? null;

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
        accessorFn: (user) => getUserRole(user, scope),
        cell: ({ row }) => <RoleSelectCell currentUserRole={currentUserRole} scope={scope} user={row.original} onChange={(role) => onRoleChange(row.original.id, role)} isLoading={isUpdating} />,
      },
      {
        accessorKey: 'status',
        cell: ({ row }) => <StatusSelectCell currentUserRole={currentUserRole} user={row.original} onChange={(status) => onStatusChange(row.original.id, status)} isLoading={isUpdating} />,
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
                    <Link href={getUsersHref(mitraSlug, `users/${user.id}?scope=${scope}`)} className="flex items-center gap-2">
                      <Eye className="size-4" />
                      Detail
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={getUsersHref(mitraSlug, `users/${user.id}/edit?scope=${scope}`)} className="flex items-center gap-2">
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  {user.deletedAt === null && (
                    <DropdownMenuItem onClick={() => onDeleteRequest(user)} className="text-destructive">
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
    [currentUserRole, mitraSlug, scope, isUpdating, onDeleteRequest, onRoleChange, onStatusChange],
  );
};
