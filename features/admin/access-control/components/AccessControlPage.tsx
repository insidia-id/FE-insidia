'use client';

import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { AccessControlDialogs } from './accessControl/AccessControlDialogs';
import { AccessControlHeader } from './accessControl/AccessControlHeader';
import { AccessControlStats } from './accessControl/AccessControlStats';
import { RoleListCard } from '../roles/components/RoleListCard';
import { ModulePermissionLibraryCard } from '../module-permission/components/ModulePermissionLibraryCard';
import { useMemo, useState } from 'react';
import { AccessScope } from '../types/access-control.types';
import { getCurrentUserScope } from '../../user/HelperUser';
import { useRoles } from '../roles/hooks/use-roles';
import { usePermissions } from '../permission/hooks/use-permisson';
import { useModulePermissions } from '../module-permission/hooks/use-module-permission';
type AccessControlPageProps = {
  currentProfile: AuthProfileResponse;
  mitraId?: string;
};

export function AccessControlPage({ currentProfile, mitraId }: AccessControlPageProps) {
  const userRole = currentProfile.insidiaRole === 'SUPER_ADMIN' || currentProfile.insidiaRole === 'ADMIN' ? currentProfile.insidiaRole : (currentProfile?.mitraRoles?.roleCode ?? currentProfile?.insidiaRole);
  const [scope, setScope] = useState<AccessScope>(() => (mitraId ? 'MITRA' : getCurrentUserScope(userRole)));
  const useRole = useRoles({ scope, mitraId });
  const usePermission = usePermissions({ scope, mitraId, selectedRole: useRole.selectedRole, selectedRoleId: useRole.selectedRoleId });
  const useModulePermission = useModulePermissions({ scope, mitraId });
  const modulePermissions = useModulePermission.modulePermissions ?? [];

  const permissions = useMemo(() => modulePermissions.flatMap((modulePermission) => modulePermission.permissions ?? []), [modulePermissions]);
  const canManageRoleCatalog = !mitraId && (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN');

  return (
    <>
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-7xl space-y-6">
          <AccessControlHeader userRole={userRole} scope={scope} scopeLocked={Boolean(mitraId)} includeDeleted={useRole.includeDeleted} onScopeChange={setScope} onIncludeDeletedChange={useRole.actions.setIncludeDeleted} />

          <AccessControlStats roles={useRole.roles} permissions={permissions} selectedRole={useRole.selectedRole} />

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="space-y-6">
              <RoleListCard
                userRole={userRole}
                roles={useRole.roles}
                scope={scope}
                isLoading={useRole.queries.rolesLoading}
                isError={useRole.queries.isRolesError}
                error={useRole.queries.rolesError}
                selectedRoleId={useRole.selectedRoleId}
                canManageRoleCatalog={canManageRoleCatalog}
                onCreateRole={useRole.actions.openCreateRoleDialog}
                onSelectRole={useRole.actions.setActiveRoleId}
                onEditRole={useRole.actions.openEditRoleDialog}
                onDeleteRole={useRole.actions.setRoleToDelete}
              />
            </div>

            <div className="space-y-6">
              <ModulePermissionLibraryCard
                userRole={userRole}
                modulePermissions={useModulePermission.modulePermissions}
                isLoading={useModulePermission.queries.modulePermissionsLoading}
                isError={useModulePermission.queries.isModulePermissionsError}
                error={useModulePermission.queries.modulePermissionsError}
                onCreateModulePermission={useModulePermission.actions.openCreateModulePermissionDialog}
                onEditModulePermission={useModulePermission.actions.openEditModulePermissionDialog}
                onDeleteModulePermission={useModulePermission.actions.setModulePermissionToDelete}
                scope={scope}
                selectedRole={useRole.selectedRole}
                selectedPermissionIds={usePermission.selectedPermissionIds}
                isSyncing={usePermission.mutations.replaceRolePermissionsMutation.isPending}
                onTogglePermission={usePermission.actions.togglePermission}
                onSyncPermissions={usePermission.actions.syncPermissions}
                onCreatePermission={usePermission.actions.openCreatePermissionDialog}
                onEditPermission={usePermission.actions.openEditPermissionDialog}
                onDeletePermission={usePermission.actions.setPermissionToDelete}
              />
            </div>
          </div>
        </section>
      </main>

      <AccessControlDialogs
        scope={scope}
        roleDialogOpen={useRole.dialogs.roleDialogOpen}
        permissionDialogOpen={usePermission.dialogs.permissionDialogOpen}
        modulePermissionDialogOpen={useModulePermission.dialogs.modulePermissionDialogOpen}
        editingRole={useRole.dialogs.editingRole}
        editingPermission={usePermission.dialogs.editingPermission}
        editingModulePermission={useModulePermission.dialogs.editingModulePermission}
        roleToDelete={useRole.dialogs.roleToDelete}
        permissionToDelete={usePermission.dialogs.permissionToDelete}
        modulePermissionToDelete={useModulePermission.dialogs.modulePermissionToDelete}
        isRoleSubmitting={useRole.mutations.createRoleMutation.isPending || useRole.mutations.updateRoleMutation.isPending}
        isPermissionSubmitting={usePermission.mutations.createPermissionMutation.isPending || usePermission.mutations.updatePermissionMutation.isPending}
        isModulePermissionSubmitting={useModulePermission.mutations.createModulePermissionMutation.isPending || useModulePermission.mutations.updateModulePermissionMutation.isPending}
        isRoleDeleting={useRole.mutations.deleteRoleMutation.isPending}
        isPermissionDeleting={usePermission.mutations.deletePermissionMutation.isPending}
        isModulePermissionDeleting={useModulePermission.mutations.deleteModulePermissionMutation.isPending}
        modulePermissions={useModulePermission.modulePermissions}
        isModulePermissionsLoading={useModulePermission.queries.modulePermissionsLoading}
        onRoleDialogOpenChange={useRole.actions.setRoleDialogOpen}
        onPermissionDialogOpenChange={usePermission.actions.setPermissionDialogOpen}
        onModulePermissionDialogOpenChange={useModulePermission.actions.setModulePermissionDialogOpen}
        onRoleDeleteTargetChange={useRole.actions.setRoleToDelete}
        onPermissionDeleteTargetChange={usePermission.actions.setPermissionToDelete}
        onModulePermissionDeleteTargetChange={useModulePermission.actions.setModulePermissionToDelete}
        onSubmitRole={useRole.actions.submitRole}
        onSubmitPermission={usePermission.actions.submitPermission}
        onSubmitModulePermission={useModulePermission.actions.submitModulePermission}
        onConfirmDeleteRole={useRole.actions.confirmDeleteRole}
        onConfirmDeletePermission={usePermission.actions.confirmDeletePermission}
        onConfirmDeleteModulePermission={useModulePermission.actions.confirmDeleteModulePermission}
      />
    </>
  );
}
