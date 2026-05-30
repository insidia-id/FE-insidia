'use client';

import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { useAccessControlPageController } from '../controller/useAccessControlPageController';
import { AccessControlDialogs } from './accessControl/AccessControlDialogs';
import { AccessControlHeader } from './accessControl/AccessControlHeader';
import { AccessControlStats } from './accessControl/AccessControlStats';
import { PermissionLibraryCard } from './permissions/PermissionLibraryCard';
import { RoleListCard } from './role/RoleListCard';
import { RolePermissionsCard } from './role/RolePermissionsCard';
type AccessControlPageProps = {
  currentProfile: AuthProfileResponse;
  mitraId?: string;
};

export function AccessControlPage({ currentProfile, mitraId }: AccessControlPageProps) {
  const userRole =
    currentProfile.insidiaRole === 'SUPER_ADMIN' ||
    currentProfile.insidiaRole === 'ADMIN'
      ? currentProfile.insidiaRole
      : currentProfile?.mitraRoles?.roleCode ?? currentProfile?.insidiaRole;
  const controller = useAccessControlPageController(currentProfile, { mitraId });
  const canManageRoleCatalog = !mitraId && (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN');

  return (
    <>
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-7xl space-y-6">
          <AccessControlHeader userRole={userRole} scope={controller.scope} scopeLocked={controller.scopeLocked} includeDeleted={controller.includeDeleted} onScopeChange={controller.actions.setScope} onIncludeDeletedChange={controller.actions.setIncludeDeleted} />

          <AccessControlStats roles={controller.roles} permissions={controller.permissions} selectedRole={controller.selectedRole} />

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-6">
              <RoleListCard
                userRole={userRole}
                roles={controller.roles}
                scope={controller.scope}
                isLoading={controller.queries.rolesLoading}
                isError={controller.queries.isRolesError}
                error={controller.queries.rolesError}
                selectedRoleId={controller.selectedRoleId}
                canManageRoleCatalog={canManageRoleCatalog}
                onCreateRole={controller.actions.openCreateRoleDialog}
                onSelectRole={controller.actions.setActiveRoleId}
                onEditRole={controller.actions.openEditRoleDialog}
                onDeleteRole={controller.actions.setRoleToDelete}
              />

              <RolePermissionsCard
                scope={controller.scope}
                selectedRole={controller.selectedRole}
                selectedPermissionIds={controller.selectedPermissionIds}
                availablePermissions={controller.availablePermissions}
                isLoading={controller.queries.permissionsLoading}
                isError={controller.queries.isPermissionsError}
                error={controller.queries.permissionsError}
                isSyncing={controller.mutations.replaceRolePermissionsMutation.isPending}
                onTogglePermission={controller.actions.togglePermission}
                onSyncPermissions={controller.actions.syncPermissions}
              />
            </div>

            <PermissionLibraryCard
              userRole={userRole}
              permissions={controller.permissions}
              scope={controller.scope}
              isLoading={controller.queries.permissionsLoading}
              isError={controller.queries.isPermissionsError}
              error={controller.queries.permissionsError}
              onCreatePermission={controller.actions.openCreatePermissionDialog}
              onEditPermission={controller.actions.openEditPermissionDialog}
              onDeletePermission={controller.actions.setPermissionToDelete}
            />
          </div>
        </section>
      </main>

      <AccessControlDialogs
        scope={controller.scope}
        roleDialogOpen={controller.dialogs.roleDialogOpen}
        permissionDialogOpen={controller.dialogs.permissionDialogOpen}
        editingRole={controller.dialogs.editingRole}
        editingPermission={controller.dialogs.editingPermission}
        roleToDelete={controller.dialogs.roleToDelete}
        permissionToDelete={controller.dialogs.permissionToDelete}
        isRoleSubmitting={controller.mutations.createRoleMutation.isPending || controller.mutations.updateRoleMutation.isPending}
        isPermissionSubmitting={controller.mutations.createPermissionMutation.isPending || controller.mutations.updatePermissionMutation.isPending}
        isRoleDeleting={controller.mutations.deleteRoleMutation.isPending}
        isPermissionDeleting={controller.mutations.deletePermissionMutation.isPending}
        onRoleDialogOpenChange={controller.actions.setRoleDialogOpen}
        onPermissionDialogOpenChange={controller.actions.setPermissionDialogOpen}
        onRoleDeleteTargetChange={controller.actions.setRoleToDelete}
        onPermissionDeleteTargetChange={controller.actions.setPermissionToDelete}
        onSubmitRole={controller.actions.submitRole}
        onSubmitPermission={controller.actions.submitPermission}
        onConfirmDeleteRole={controller.actions.confirmDeleteRole}
        onConfirmDeletePermission={controller.actions.confirmDeletePermission}
      />
    </>
  );
}
