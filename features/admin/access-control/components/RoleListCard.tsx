import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AccessScope, Role } from '../types/access-control.types';
import { getRoleStatus } from './access-control.helper';

type RoleListCardProps = {
  roles: Role[];
  scope: AccessScope;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectedRoleId: string | null;
  onCreateRole: () => void;
  onSelectRole: (roleId: string) => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
};

export function RoleListCard({ roles, scope, isLoading, isError, error, selectedRoleId, onCreateRole, onSelectRole, onEditRole, onDeleteRole }: RoleListCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Daftar Role</CardTitle>
          <CardDescription>{isLoading ? 'Memuat role...' : `${roles.length} role pada scope ${scope.toLowerCase()}`}</CardDescription>
        </div>

        <Button type="button" variant="insidia" onClick={onCreateRole}>
          <Plus className="size-4" />
          Tambah Role
        </Button>
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
                const totalUsers = role._count.platformUsers + role._count.mitraUsers;
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
                    <TableCell>{role.code === 'SUPER_ADMIN' ? 'All' : role._count.permissions}</TableCell>
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
                        {!role.deletedAt && (
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
