import { useState, useMemo } from 'react';
import { useCreatePermission, useDeletePermission, useReplaceRolePermissions, useUpdatePermission } from './use-permission-query';
import type { Permission, PermissionFormValues } from '../types/permission.types';
import type { AccessScope } from '../../types/access-control.types';
import { resolveSelectedPermissionIds } from '../../lib/access-control.helper';
import { Role } from '../../roles/types/role.types';
type UsePermissionsProps = {
  scope: AccessScope;
  mitraId?: string;
  selectedRole: Role | null;
  selectedRoleId: string | null;
};
export function usePermissions({ scope, mitraId, selectedRole, selectedRoleId }: UsePermissionsProps) {
  const [permissionDraft, setPermissionDraft] = useState<{
    roleId: string | null;
    permissionIds: string[];
  }>({
    roleId: null,
    permissionIds: [],
  });
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const replaceRolePermissionsMutation = useReplaceRolePermissions();
  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const selectedPermissionIds = useMemo(
    () =>
      resolveSelectedPermissionIds({
        permissionDraft,
        selectedRole,
        selectedRoleId,
      }),
    [permissionDraft, selectedRole, selectedRoleId],
  );
  const openCreatePermissionDialog = () => {
    setEditingPermission(null);
    setPermissionDialogOpen(true);
  };

  const openEditPermissionDialog = (permission: Permission) => {
    setEditingPermission(permission);
    setPermissionDialogOpen(true);
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
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
  };

  const syncPermissions = () => {
    if (!selectedRole) {
      return;
    }

    replaceRolePermissionsMutation.mutate({
      roleId: selectedRole.id,
      permissionIds: selectedPermissionIds,
      scope: selectedRole.scope,
      mitraId,
    });
  };

  const submitPermission = (values: PermissionFormValues) => {
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
  };

  const confirmDeletePermission = () => {
    if (!permissionToDelete) {
      return;
    }

    deletePermissionMutation.mutate(
      {
        permissionId: permissionToDelete.id,
      },
      {
        onSuccess: () => {
          setPermissionToDelete(null);
        },
      },
    );
  };
  return {
    selectedPermissionIds,
    dialogs: {
      permissionDialogOpen,
      editingPermission,
      permissionToDelete,
    },
    mutations: {
      replaceRolePermissionsMutation,
      createPermissionMutation,
      updatePermissionMutation,
      deletePermissionMutation,
    },
    actions: {
      setPermissionDialogOpen,
      setPermissionToDelete,
      openCreatePermissionDialog,
      openEditPermissionDialog,
      togglePermission,
      syncPermissions,
      submitPermission,
      confirmDeletePermission,
    },
  };
}
