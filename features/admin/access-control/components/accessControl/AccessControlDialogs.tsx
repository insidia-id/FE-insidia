import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { RoleDialog } from '../role/RoleDialog';
import { PermissionDialog } from '../permissions/PermissionDialog';
import type { PermissionFormValues, RoleFormValues } from '../../schema/access-control.schema';
import type { AccessScope, Permission, Role } from '../../types/access-control.types';

type AccessControlDialogsProps = {
  scope: AccessScope;
  roleDialogOpen: boolean;
  permissionDialogOpen: boolean;
  editingRole: Role | null;
  editingPermission: Permission | null;
  roleToDelete: Role | null;
  permissionToDelete: Permission | null;
  isRoleSubmitting: boolean;
  isPermissionSubmitting: boolean;
  isRoleDeleting: boolean;
  isPermissionDeleting: boolean;
  onRoleDialogOpenChange: (open: boolean) => void;
  onPermissionDialogOpenChange: (open: boolean) => void;
  onRoleDeleteTargetChange: (role: Role | null) => void;
  onPermissionDeleteTargetChange: (permission: Permission | null) => void;
  onSubmitRole: (values: RoleFormValues) => void;
  onSubmitPermission: (values: PermissionFormValues) => void;
  onConfirmDeleteRole: () => void;
  onConfirmDeletePermission: () => void;
};

export function AccessControlDialogs({
  scope,
  roleDialogOpen,
  permissionDialogOpen,
  editingRole,
  editingPermission,
  roleToDelete,
  permissionToDelete,
  isRoleSubmitting,
  isPermissionSubmitting,
  isRoleDeleting,
  isPermissionDeleting,
  onRoleDialogOpenChange,
  onPermissionDialogOpenChange,
  onRoleDeleteTargetChange,
  onPermissionDeleteTargetChange,
  onSubmitRole,
  onSubmitPermission,
  onConfirmDeleteRole,
  onConfirmDeletePermission,
}: AccessControlDialogsProps) {
  return (
    <>
      <RoleDialog open={roleDialogOpen} onOpenChange={onRoleDialogOpenChange} scope={scope} role={editingRole} isLoading={isRoleSubmitting} onSubmit={onSubmitRole} />

      <PermissionDialog open={permissionDialogOpen} onOpenChange={onPermissionDialogOpenChange} scope={scope} permission={editingPermission} isLoading={isPermissionSubmitting} onSubmit={onSubmitPermission} />

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
    </>
  );
}
