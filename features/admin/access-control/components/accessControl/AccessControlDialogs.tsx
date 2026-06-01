import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { RoleDialog } from '../../roles/components/RoleDialog';
import { PermissionDialog } from '../../permission/components/PermissionDialog';
import { ModulePermissionDialog } from '../../module-permission/components/ModulePermissionDialog';
import type { AccessScope } from '../../types/access-control.types';
import type { RoleFormValues, Role } from '../../roles/types/role.types';
import type { Permission, PermissionFormValues } from '../../permission/types/permission.types';
import type { ModulePermission, ModulePermissionFormValues } from '../../module-permission/types/module-permission.types';
type AccessControlDialogsProps = {
  scope: AccessScope;
  roleDialogOpen: boolean;
  permissionDialogOpen: boolean;
  modulePermissionDialogOpen: boolean;
  editingRole: Role | null;
  editingPermission: Permission | null;
  editingModulePermission: ModulePermission | null;
  roleToDelete: Role | null;
  permissionToDelete: Permission | null;
  modulePermissionToDelete: ModulePermission | null;
  isRoleSubmitting: boolean;
  isPermissionSubmitting: boolean;
  isModulePermissionSubmitting: boolean;
  isRoleDeleting: boolean;
  isPermissionDeleting: boolean;
  isModulePermissionDeleting: boolean;
  modulePermissions: ModulePermission[];
  isModulePermissionsLoading: boolean;
  onRoleDialogOpenChange: (open: boolean) => void;
  onPermissionDialogOpenChange: (open: boolean) => void;
  onModulePermissionDialogOpenChange: (open: boolean) => void;
  onRoleDeleteTargetChange: (role: Role | null) => void;
  onPermissionDeleteTargetChange: (permission: Permission | null) => void;
  onModulePermissionDeleteTargetChange: (modulePermission: ModulePermission | null) => void;
  onSubmitRole: (values: RoleFormValues) => void;
  onSubmitPermission: (values: PermissionFormValues) => void;
  onSubmitModulePermission: (values: ModulePermissionFormValues) => void;
  onConfirmDeleteRole: () => void;
  onConfirmDeletePermission: () => void;
  onConfirmDeleteModulePermission: () => void;
};

export function AccessControlDialogs({
  scope,
  roleDialogOpen,
  permissionDialogOpen,
  modulePermissionDialogOpen,
  editingRole,
  editingPermission,
  editingModulePermission,
  roleToDelete,
  permissionToDelete,
  modulePermissionToDelete,
  isRoleSubmitting,
  isPermissionSubmitting,
  isModulePermissionSubmitting,
  isRoleDeleting,
  isPermissionDeleting,
  isModulePermissionDeleting,
  modulePermissions,
  isModulePermissionsLoading,
  onRoleDialogOpenChange,
  onPermissionDialogOpenChange,
  onModulePermissionDialogOpenChange,
  onRoleDeleteTargetChange,
  onPermissionDeleteTargetChange,
  onModulePermissionDeleteTargetChange,
  onSubmitRole,
  onSubmitPermission,
  onSubmitModulePermission,
  onConfirmDeleteRole,
  onConfirmDeletePermission,
  onConfirmDeleteModulePermission,
}: AccessControlDialogsProps) {
  return (
    <>
      <RoleDialog open={roleDialogOpen} onOpenChange={onRoleDialogOpenChange} scope={scope} role={editingRole} isLoading={isRoleSubmitting} onSubmit={onSubmitRole} />

      <PermissionDialog
        open={permissionDialogOpen}
        onOpenChange={onPermissionDialogOpenChange}
        scope={scope}
        permission={editingPermission}
        modulePermissions={modulePermissions}
        isModulePermissionsLoading={isModulePermissionsLoading}
        isLoading={isPermissionSubmitting}
        onSubmit={onSubmitPermission}
      />

      <ModulePermissionDialog open={modulePermissionDialogOpen} onOpenChange={onModulePermissionDialogOpenChange} modulePermission={editingModulePermission} isLoading={isModulePermissionSubmitting} onSubmit={onSubmitModulePermission} />

      <ConfirmDeleteDialog
        open={Boolean(roleToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            onRoleDeleteTargetChange(null);
          }
        }}
        description={roleToDelete ? `Role ${roleToDelete.name} akan ditandai terhapus. Relasi user aktif pada role ini harus sudah kosong.` : ''}
        isLoading={isRoleDeleting}
        onConfirm={onConfirmDeleteRole}
      />

      <ConfirmDeleteDialog
        open={Boolean(permissionToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            onPermissionDeleteTargetChange(null);
          }
        }}
        description={permissionToDelete ? `Permission ${permissionToDelete.name} akan dihapus permanen dari daftar permission.` : ''}
        isLoading={isPermissionDeleting}
        onConfirm={onConfirmDeletePermission}
      />

      <ConfirmDeleteDialog
        open={Boolean(modulePermissionToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            onModulePermissionDeleteTargetChange(null);
          }
        }}
        description={modulePermissionToDelete ? `Module permission ${modulePermissionToDelete.module} akan dihapus permanen dari daftar module.` : ''}
        isLoading={isModulePermissionDeleting}
        onConfirm={onConfirmDeleteModulePermission}
      />
    </>
  );
}
