import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { AccessScope, Permission } from '../types/access-control.types';

type PermissionLibraryCardProps = {
  permissions: Permission[];
  scope: AccessScope;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onCreatePermission: () => void;
  onEditPermission: (permission: Permission) => void;
  onDeletePermission: (permission: Permission) => void;
};

export function PermissionLibraryCard({
  permissions,
  scope,
  isLoading,
  isError,
  error,
  onCreatePermission,
  onEditPermission,
  onDeletePermission,
}: PermissionLibraryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Library Permission</CardTitle>
          <CardDescription>{isLoading ? 'Memuat permission...' : `${permissions.length} permission tersedia pada scope ${scope.toLowerCase()}`}</CardDescription>
        </div>

        <Button type="button" variant="insidia" onClick={onCreatePermission}>
          <Plus className="size-4" />
          Tambah Permission
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error?.message ?? 'Gagal memuat permission.'}</div>
        ) : permissions.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">Belum ada permission pada scope ini.</div>
        ) : (
          <div className="space-y-3">
            {permissions.map((permission) => (
              <div key={permission.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{permission.name}</p>
                      <Badge variant="outline">{permission.scope}</Badge>
                    </div>
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{permission.code}</p>
                    <p className="text-sm text-muted-foreground">{permission.description || 'Tanpa deskripsi'}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="icon-sm" onClick={() => onEditPermission(permission)}>
                      <Pencil className="size-4" />
                      <span className="sr-only">Edit permission</span>
                    </Button>
                    <Button type="button" variant="destructive" size="icon-sm" onClick={() => onDeletePermission(permission)}>
                      <Trash2 className="size-4" />
                      <span className="sr-only">Hapus permission</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
