import { RefreshCcw } from 'lucide-react';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccessScope, Permission, Role } from '../types/access-control.types';

type RolePermissionsCardProps = {
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
};

export function RolePermissionsCard({
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
}: RolePermissionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Permission Role</CardTitle>
          <CardDescription>
            {selectedRole ? `Atur permission untuk role ${selectedRole.name}` : 'Pilih role dari tabel di atas untuk mengatur permission-nya.'}
          </CardDescription>
        </div>

        <LoadingButton type="button" variant="default" isLoading={isSyncing} disabled={!selectedRole || isLoading} onClick={onSyncPermissions}>
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
          <div className="space-y-3">
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
                    <p className="text-sm text-muted-foreground">{permission.description || 'Tanpa deskripsi'}</p>
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
