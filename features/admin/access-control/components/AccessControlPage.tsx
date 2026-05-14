'use client';

import { useMemo, useState } from 'react';
import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { Button } from '@/components/ui/button';
import { useCreatePermission, useCreateRole, useDeletePermission, useDeleteRole, useGetPermissions, useGetRoles, useReplaceRolePermissions, useUpdatePermission, useUpdateRole } from '../hooks/useAccessControl';
import type { AccessScope, Permission, Role } from '../types/access-control.types';
import { AccessControlStats } from './AccessControlStats';
import { ACCESS_SCOPE_OPTIONS } from './access-control.helper';
import { PermissionDialog } from './PermissionDialog';
import { PermissionLibraryCard } from './PermissionLibraryCard';
import { RoleDialog } from './RoleDialog';
import { RoleListCard } from './RoleListCard';
import { RolePermissionsCard } from './RolePermissionsCard';

export function AccessControlPage() {
  const [scope, setScope] = useState<AccessScope>('PLATFORM');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<{
    roleId: string | null;
    permissionIds: string[];
  }>({
    roleId: null,
    permissionIds: [],
  });
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const { data: roles = [], isLoading: rolesLoading, isError: isRolesError, error: rolesError } = useGetRoles(scope, includeDeleted);
  const { data: permissions = [], isLoading: permissionsLoading, isError: isPermissionsError, error: permissionsError } = useGetPermissions(scope);
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const replaceRolePermissionsMutation = useReplaceRolePermissions();
  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const selectedRoleId = useMemo(() => {
    if (activeRoleId && roles.some((role) => role.id === activeRoleId)) {
      return activeRoleId;
    }

    return roles[0]?.id ?? null;
  }, [activeRoleId, roles]);

  const selectedRole = useMemo(() => roles.find((role) => role.id === selectedRoleId) ?? null, [roles, selectedRoleId]);

  const selectedPermissionIds = useMemo(() => {
    if (permissionDraft.roleId === selectedRoleId) {
      return permissionDraft.permissionIds;
    }

    return selectedRole?.permissions.map((item) => item.permissionId) ?? [];
  }, [permissionDraft, selectedRole, selectedRoleId]);

  const availablePermissions = useMemo(() => permissions.filter((permission) => permission.scope === scope), [permissions, scope]);

  return (
    <>
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-7xl space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Akses Platform</p>
              <h1 className="text-3xl font-semibold text-foreground">Role & Permission</h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">Kelola daftar role, library permission, dan relasi keduanya dari satu permukaan kerja yang konsisten dengan API backend.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-lg border bg-background p-1">
                {ACCESS_SCOPE_OPTIONS.map((option) => (
                  <Button key={option.value} type="button" variant={scope === option.value ? 'default' : 'ghost'} size="sm" onClick={() => setScope(option.value)}>
                    {option.label}
                  </Button>
                ))}
              </div>

              <label className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={includeDeleted} onChange={(event) => setIncludeDeleted(event.target.checked)} />
                Tampilkan role terhapus
              </label>
            </div>
          </div>
          <AccessControlStats roles={roles} permissions={permissions} selectedRole={selectedRole} />

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-6">
              <RoleListCard
                roles={roles}
                scope={scope}
                isLoading={rolesLoading}
                isError={isRolesError}
                error={rolesError instanceof Error ? rolesError : null}
                selectedRoleId={selectedRoleId}
                onCreateRole={() => {
                  setEditingRole(null);
                  setRoleDialogOpen(true);
                }}
                onSelectRole={setActiveRoleId}
                onEditRole={(role) => {
                  setEditingRole(role);
                  setRoleDialogOpen(true);
                }}
                onDeleteRole={setRoleToDelete}
              />

              <RolePermissionsCard
                scope={scope}
                selectedRole={selectedRole}
                selectedPermissionIds={selectedPermissionIds}
                availablePermissions={availablePermissions}
                isLoading={permissionsLoading}
                isError={isPermissionsError}
                error={permissionsError instanceof Error ? permissionsError : null}
                isSyncing={replaceRolePermissionsMutation.isPending}
                onTogglePermission={(permissionId, checked) => {
                  if (!selectedRoleId) {
                    return;
                  }

                  setPermissionDraft((current) => {
                    const currentValues = current.roleId === selectedRoleId ? current.permissionIds : (selectedRole?.permissions.map((item) => item.permissionId) ?? []);
                    const nextPermissionIds = checked ? (currentValues.includes(permissionId) ? currentValues : [...currentValues, permissionId]) : currentValues.filter((item) => item !== permissionId);

                    return {
                      roleId: selectedRoleId,
                      permissionIds: nextPermissionIds,
                    };
                  });
                }}
                onSyncPermissions={() => {
                  if (!selectedRole) {
                    return;
                  }

                  replaceRolePermissionsMutation.mutate({
                    roleId: selectedRole.id,
                    permissionIds: selectedPermissionIds,
                    scope: selectedRole.scope,
                  });
                }}
              />
            </div>

            <PermissionLibraryCard
              permissions={permissions}
              scope={scope}
              isLoading={permissionsLoading}
              isError={isPermissionsError}
              error={permissionsError instanceof Error ? permissionsError : null}
              onCreatePermission={() => {
                setEditingPermission(null);
                setPermissionDialogOpen(true);
              }}
              onEditPermission={(permission) => {
                setEditingPermission(permission);
                setPermissionDialogOpen(true);
              }}
              onDeletePermission={setPermissionToDelete}
            />
          </div>
        </section>
      </main>

      <RoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        scope={scope}
        role={editingRole}
        isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
        onSubmit={(values) => {
          if (editingRole) {
            updateRoleMutation.mutate(
              {
                roleId: editingRole.id,
                data: values,
              },
              {
                onSuccess: () => {
                  setRoleDialogOpen(false);
                  setEditingRole(null);
                },
              },
            );

            return;
          }

          createRoleMutation.mutate(values, {
            onSuccess: () => {
              setRoleDialogOpen(false);
            },
          });
        }}
      />

      <PermissionDialog
        open={permissionDialogOpen}
        onOpenChange={setPermissionDialogOpen}
        scope={scope}
        permission={editingPermission}
        isLoading={createPermissionMutation.isPending || updatePermissionMutation.isPending}
        onSubmit={(values) => {
          if (editingPermission) {
            updatePermissionMutation.mutate(
              {
                permissionId: editingPermission.id,
                data: values,
              },
              {
                onSuccess: () => {
                  setPermissionDialogOpen(false);
                  setEditingPermission(null);
                },
              },
            );

            return;
          }

          createPermissionMutation.mutate(values, {
            onSuccess: () => {
              setPermissionDialogOpen(false);
            },
          });
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(roleToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setRoleToDelete(null);
          }
        }}
        description={roleToDelete ? `Role ${roleToDelete.name} akan ditandai terhapus. Relasi user aktif pada role ini harus sudah kosong.` : ''}
        isLoading={deleteRoleMutation.isPending}
        onConfirm={() => {
          if (!roleToDelete) {
            return;
          }

          deleteRoleMutation.mutate(roleToDelete.id, {
            onSuccess: () => {
              setRoleToDelete(null);
            },
          });
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(permissionToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPermissionToDelete(null);
          }
        }}
        description={permissionToDelete ? `Permission ${permissionToDelete.name} akan dihapus permanen dari daftar permission.` : ''}
        isLoading={deletePermissionMutation.isPending}
        onConfirm={() => {
          if (!permissionToDelete) {
            return;
          }

          deletePermissionMutation.mutate(
            {
              permissionId: permissionToDelete.id,
              scope: permissionToDelete.scope,
            },
            {
              onSuccess: () => {
                setPermissionToDelete(null);
              },
            },
          );
        }}
      />
    </>
  );
}
