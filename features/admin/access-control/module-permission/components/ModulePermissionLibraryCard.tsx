import { useState } from 'react';
import { ChevronDownIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ModulePermission } from '../types/module-permission.types';
import { Role } from '../../roles/types/role.types';
import { Permission } from '../../permission/types/permission.types';
import { PermissionsCard } from './PermissionCard';
import { AccessScope } from '../../types/access-control.types';
import { PermissionDetailDialog } from './PermissionDetailDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
type ModulePermissionLibraryCardProps = {
  userRole: string;
  modulePermissions: ModulePermission[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onCreateModulePermission: () => void;
  onEditModulePermission: (modulePermission: ModulePermission) => void;
  onDeleteModulePermission: (modulePermission: ModulePermission) => void;
  scope: AccessScope;
  selectedRole: Role | null;
  selectedPermissionIds: string[];
  isSyncing: boolean;
  onTogglePermission: (permissionId: string, checked: boolean) => void;
  onSyncPermissions: () => void;
  onCreatePermission: () => void;
  onEditPermission: (permission: Permission) => void;
  onDeletePermission: (permission: Permission) => void;
};

export function ModulePermissionLibraryCard({
  userRole,
  modulePermissions,
  isLoading,
  isError,
  error,
  onCreateModulePermission,
  onEditModulePermission,
  onDeleteModulePermission,
  scope,
  selectedRole,
  selectedPermissionIds,
  isSyncing,
  onTogglePermission,
  onSyncPermissions,
  onCreatePermission,
  onEditPermission,
  onDeletePermission,
}: ModulePermissionLibraryCardProps) {
  const [viewingPermission, setViewingPermission] = useState<Permission | null>(null);
  console.log('Rendering ModulePermissionLibraryCard with modulePermissions:', modulePermissions);
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Module Permission</CardTitle>
          <CardDescription>{isLoading ? 'Memuat module permission...' : `${modulePermissions?.length ?? 0} module permission tersedia`}</CardDescription>
        </div>
        {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
          <div className="flex gap-2">
            <Button type="button" variant="insidia" onClick={onCreateModulePermission}>
              <Plus className="size-4" />
              Tambah Module
            </Button>
            <Button type="button" variant="insidia" onClick={onCreatePermission}>
              <Plus className="size-4" />
              Tambah Permission
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error?.message ?? 'Gagal memuat module permission.'}</div>
        ) : modulePermissions.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">Belum ada module permission.</div>
        ) : (
          <div className="space-y-3">
            {modulePermissions?.map((modulePermission) => (
              <Collapsible key={modulePermission.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{modulePermission.module}</p>
                      <Badge variant="outline">{modulePermission.permissions?.length ?? 0} permission</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{modulePermission.description || 'Tanpa deskripsi'}</p>
                  </div>
                  <CollapsibleTrigger asChild>
                    <button type="button" className="group ml-auto rounded-md p-1 transition-colors hover:bg-accent">
                      <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  {(userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') && (
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="icon-sm" onClick={() => onEditModulePermission(modulePermission)}>
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit module permission</span>
                      </Button>
                      <Button type="button" variant="destructive" size="icon-sm" onClick={() => onDeleteModulePermission(modulePermission)}>
                        <Trash2 className="size-4" />
                        <span className="sr-only">Hapus module permission</span>
                      </Button>
                    </div>
                  )}
                </div>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-[collapsible-up_200ms_ease-out] data-[state=open]:animate-[collapsible-down_200ms_ease-out]">
                  <div className="mt-4 w-full">
                    <PermissionsCard
                      userRole={userRole}
                      onEditPermission={onEditPermission}
                      onDeletePermission={onDeletePermission}
                      onViewPermission={setViewingPermission}
                      scope={scope}
                      selectedRole={selectedRole}
                      selectedPermissionIds={selectedPermissionIds}
                      availablePermissions={modulePermission.permissions}
                      isLoading={isLoading}
                      isError={isError}
                      error={error}
                      isSyncing={isSyncing}
                      onTogglePermission={onTogglePermission}
                      onSyncPermissions={onSyncPermissions}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>

      <PermissionDetailDialog
        open={Boolean(viewingPermission)}
        onOpenChange={(open) => {
          if (!open) {
            setViewingPermission(null);
          }
        }}
        permission={viewingPermission}
      />
    </Card>
  );
}
