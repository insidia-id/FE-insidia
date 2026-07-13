import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AccessScope } from '../../types/access-control.types';
import { getRoleStatus } from '../../lib/access-control.helper';
import type { Role } from '../types/role.types';
import { Dispatch, SetStateAction } from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/common/Combobox';

type RoleListCardProps = {
  userRole: string | null;
  roles: Role[];
  scope: AccessScope;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectedRoleId: string | null;
  canManageRoleCatalog: boolean;
  onCreateRole: () => void;
  onSelectRole: (roleId: string) => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
  selectedMitraId?: string;
  setSelectedMitraId?: Dispatch<SetStateAction<string | undefined>>;
  mitraOptions?: { label: string; value: string }[];
  isLoadingMitras?: boolean;
  setMitraQuery?: (query: string) => void;
};

export function RoleListCard({
  userRole,
  roles,
  scope,
  isLoading,
  isError,
  error,
  selectedRoleId,
  canManageRoleCatalog,
  onCreateRole,
  onSelectRole,
  onEditRole,
  onDeleteRole,
  selectedMitraId,
  setSelectedMitraId,
  mitraOptions,
  isLoadingMitras,
  setMitraQuery,
}: RoleListCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <CardTitle>Daftar Role</CardTitle>
          <CardDescription>{isLoading ? 'Memuat role...' : `${roles.length} role pada scope ${scope.toLowerCase()}`}</CardDescription>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {userRole === 'SUPER_ADMIN' && scope === 'MITRA' && (
            <div className="w-full sm:w-72">
              <Label className="mb-2 block">Mitra</Label>

              <Combobox
                data={[
                  {
                    value: '',
                    label: 'Semua Mitra',
                  },
                  ...(mitraOptions ?? []),
                ]}
                value={selectedMitraId}
                placeholder="Semua Mitra"
                onSearch={setMitraQuery}
                onChange={(value) => {
                  setSelectedMitraId?.(value || undefined);
                }}
                disabled={isLoadingMitras}
              />
            </div>
          )}

          {canManageRoleCatalog && (
            <Button type="button" variant="insidia" onClick={onCreateRole} className="w-full sm:w-auto">
              <Plus className="size-4" />
              Tambah Role
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error?.message ?? 'Gagal memuat role.'}</div>
        ) : roles.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">Belum ada role untuk scope ini.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => {
                const status = getRoleStatus(role);
                const totalUsers = role._count.insidiaUsers ?? role._count.mitraUsers;
                const totalPermissions = role._count.permissions ?? role._count.mitraRolePermissions;
                return (
                  <TableRow key={role.id} data-state={selectedRoleId === role.id ? 'selected' : undefined}>
                    <TableCell className="align-top">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{role.name}</p>
                        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{role.code}</p>
                        <p className="max-w-xl whitespace-normal text-xs text-muted-foreground">{role.description || 'Tanpa deskripsi'}</p>
                      </div>
                    </TableCell>
                    <TableCell>{role.scope}</TableCell>
                    <TableCell>{role.code === 'SUPER_ADMIN' ? 'All' : totalPermissions}</TableCell>
                    <TableCell>{totalUsers}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {role.code === 'SUPER_ADMIN' ? (
                          <Button type="button" variant="outline" size="sm" disabled>
                            Kelola
                          </Button>
                        ) : (
                          <Button type="button" variant={selectedRoleId === role.id ? 'default' : 'outline'} size="sm" onClick={() => onSelectRole(role.id)}>
                            Kelola
                          </Button>
                        )}

                        {canManageRoleCatalog && (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && !role.deletedAt && (
                          <>
                            <Button type="button" variant="outline" size="icon-sm" onClick={() => onEditRole(role)}>
                              <Pencil className="size-4" />
                              <span className="sr-only">Edit role</span>
                            </Button>
                            {!role.isSystem && (
                              <Button type="button" variant="destructive" size="icon-sm" onClick={() => onDeleteRole(role)}>
                                <Trash2 className="size-4" />
                                <span className="sr-only">Hapus role</span>
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
