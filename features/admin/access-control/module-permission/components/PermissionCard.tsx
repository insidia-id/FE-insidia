import { Eye, RefreshCcw, Pencil, Trash2 } from 'lucide-react';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccessScope } from '../../types/access-control.types';
import type { Permission } from '../../permission/types/permission.types';
import type { Role } from '../../roles/types/role.types';
import { Button } from '@/components/ui/button';
type PermissionsCardProps = {
  userRole: string;
  scope: AccessScope;
  selectedRole: Role | null;
  selectedPermissionIds: string[];
  availablePermissions: Permission[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSyncing: boolean;
  onTogglePermission: (permissionId: string, checked: boolean) => void;
  onSyncPermissions: () => void;
  onViewPermission: (permission: Permission) => void;
  onEditPermission: (permission: Permission) => void;
  onDeletePermission: (permission: Permission) => void;
};

export function PermissionsCard({
  scope,
  selectedRole,
  selectedPermissionIds,
  availablePermissions,
  isLoading,
  isError,
  error,
  isSyncing,
  onTogglePermission,
  onSyncPermissions,
  userRole,
  onViewPermission,
  onEditPermission,
  onDeletePermission,
}: PermissionsCardProps) {
  const canManage = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardDescription>{selectedRole ? `Atur permission untuk role ${selectedRole.name}` : 'Pilih role dari tabel di atas untuk mengatur permission-nya.'}</CardDescription>
        </div>

        <LoadingButton type="button" variant="insidia" isLoading={isSyncing} disabled={!selectedRole || isLoading} onClick={onSyncPermissions}>
          <RefreshCcw className="size-4" />
          Sinkronkan Permission
        </LoadingButton>
      </CardHeader>

      <CardContent>
        {!selectedRole ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">Belum ada role yang dipilih.</div>
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error?.message ?? 'Gagal memuat permission.'}</div>
        ) : availablePermissions.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">Belum ada permission untuk scope {scope.toLowerCase()}.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
            {availablePermissions.map((permission) => {
              const checked = selectedPermissionIds.includes(permission.id);

              return (
                <label key={permission.id} className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40">
                  <input type="checkbox" className="mt-1 size-4" checked={checked} onChange={(event) => onTogglePermission(permission.id, event.target.checked)} />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{permission.name}</p>
                      <Badge variant="outline">{permission.scope}</Badge>
                    </div>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{permission.code}</p>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="icon-sm" onClick={() => onViewPermission(permission)}>
                        <Eye className="size-4" />
                        <span className="sr-only">Lihat detail permission</span>
                      </Button>
                      {canManage && (
                        <>
                          <Button type="button" variant="outline" size="icon-sm" onClick={() => onEditPermission(permission)}>
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit permission</span>
                          </Button>
                          <Button type="button" variant="destructive" size="icon-sm" onClick={() => onDeletePermission(permission)}>
                            <Trash2 className="size-4" />
                            <span className="sr-only">Hapus permission</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
