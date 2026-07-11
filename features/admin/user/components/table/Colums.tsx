import { ColumnDef } from '@tanstack/react-table';
import { StatusUser, User, UserRoleCode, UserScope } from '../../types/user.types';
import { ArrowUpDown, Eye, Pencil, MoreVertical, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { canManage, canManageRole, formatDateTime, formatStatus, getActiveMitraContext, getAssignableRoleOptions, getStatusVariant, getUserRole, getUsersHref, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../../HelperUser';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserTableColumnId } from '../../config/user-page.config';
import { Permissions } from '@/lib/helper/permission.helper';

function RoleSelectCell({ currentUserRole, scope, user, onChange, isLoading }: { currentUserRole?: string | null; scope: UserScope; user: User; onChange: (role: UserRoleCode) => void; isLoading: boolean }) {
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
  columnIds: UserTableColumnId[];
  isUpdating: boolean;
  onDeleteRequest: (user: User) => void;
  onRoleChange: (userId: string, role: UserRoleCode) => void;
  onStatusChange: (userId: string, status: StatusUser) => void;
};
export const useUserColumns = ({ currentProfile, scope, columnIds, isUpdating, onDeleteRequest, onRoleChange, onStatusChange }: UseUserColumnsProps) => {
  const { activeMitraRole, activeMitraSlug, activeInsidiaRole } = getActiveMitraContext(currentProfile);
  const currentUserRole = activeMitraRole ?? activeInsidiaRole;
  const canUpdate = canManage(currentProfile, [Permissions.userPermissions.update[scope]]);
  const canDelete = canManage(currentProfile, [Permissions.userPermissions.delete[scope]]);
  return useMemo<ColumnDef<User>[]>(() => {
    const columnsById: Record<UserTableColumnId, ColumnDef<User>> = {
      name: {
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
      role: {
        id: 'role',
        header: 'Role',
        accessorFn: (user) => getUserRole(user, scope),
        cell: ({ row }) => <RoleSelectCell currentUserRole={currentUserRole} scope={scope} user={row.original} onChange={(role) => onRoleChange(row.original.id, role)} isLoading={isUpdating} />,
      },
      status: {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusSelectCell currentUserRole={currentUserRole} user={row.original} onChange={(status) => onStatusChange(row.original.id, status)} isLoading={isUpdating} />,
      },
      createdAt: {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Dibuat
            <ArrowUpDown className="size-4" />
          </Button>
        ),
        cell: ({ row }) => formatDateTime(row.original.createdAt),
      },
      nip: {
        id: 'nip',
        header: 'NIP',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'GURU');
          return mitraRole?.profile?.nip || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'GURU');
          return <span className="text-sm">{mitraRole?.profile?.nip || '-'}</span>;
        },
      },
      subject: {
        id: 'subject',
        header: 'Mata Pelajaran',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'GURU');
          return mitraRole?.profile?.subject || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'GURU');
          return <span className="text-sm">{mitraRole?.profile?.subject || '-'}</span>;
        },
      },
      nis: {
        id: 'nis',
        header: 'NIS',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'MURID');
          return mitraRole?.profile?.nis || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'MURID');
          return <span className="text-sm">{mitraRole?.profile?.nis || '-'}</span>;
        },
      },
      kelas: {
        id: 'kelas',
        header: 'Kelas',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'MURID');
          return mitraRole?.profile?.kelas || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'MURID');
          return <span className="text-sm">{mitraRole?.profile?.kelas || '-'}</span>;
        },
      },
      jurusan: {
        id: 'jurusan',
        header: 'Jurusan',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'MURID');
          return mitraRole?.profile?.jurusan || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'MURID');
          return <span className="text-sm">{mitraRole?.profile?.jurusan || '-'}</span>;
        },
      },
      pekerjaan: {
        id: 'pekerjaan',
        header: 'Pekerjaan',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'WALI_MURID');
          return mitraRole?.profile?.pekerjaan || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'WALI_MURID');
          return <span className="text-sm">{mitraRole?.profile?.pekerjaan || '-'}</span>;
        },
      },
      position: {
        id: 'position',
        header: 'Jabatan',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'AKADEMIK');
          return mitraRole?.profile?.position || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'AKADEMIK');
          return <span className="text-sm">{mitraRole?.profile?.position || '-'}</span>;
        },
      },
      division: {
        id: 'division',
        header: 'Divisi',
        accessorFn: (user) => {
          const mitraRole = user.mitraRoles?.find((mr) => mr.roleCode === 'AKADEMIK');
          return mitraRole?.profile?.division || '-';
        },
        cell: ({ row }) => {
          const mitraRole = row.original.mitraRoles?.find((mr) => mr.roleCode === 'AKADEMIK');
          return <span className="text-sm">{mitraRole?.profile?.division || '-'}</span>;
        },
      },
      actions: {
        id: 'actions',
        header: 'Aksi',
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
                    <Link href={getUsersHref(activeMitraSlug, `users/${user.id}?scope=${scope}`)} className="flex items-center gap-2">
                      <Eye className="size-4" />
                      Detail
                    </Link>
                  </DropdownMenuItem>
                  {canUpdate && (
                    <DropdownMenuItem asChild>
                      <Link href={getUsersHref(activeMitraSlug, `users/${user.id}/edit?scope=${scope}`)} className="flex items-center gap-2">
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {canDelete && user.deletedAt === null && (
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
    };

    return columnIds.map((columnId) => columnsById[columnId]);
  }, [columnIds, currentUserRole, activeMitraSlug, scope, isUpdating, onDeleteRequest, onRoleChange, onStatusChange]);
};
