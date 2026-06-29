import { useState } from 'react';
import { useCreatePermission, useDeletePermission, useUpdatePermission } from './use-permission-query';
import type { Permission, PermissionFormValues } from '../types/permission.types';

export function usePermissions() {
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const openCreatePermissionDialog = () => {
    setEditingPermission(null);
    setPermissionDialogOpen(true);
  };

  const openEditPermissionDialog = (permission: Permission) => {
    setEditingPermission(permission);
    setPermissionDialogOpen(true);
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
    dialogs: {
      permissionDialogOpen,
      editingPermission,
      permissionToDelete,
    },
    mutations: {
      createPermissionMutation,
      updatePermissionMutation,
      deletePermissionMutation,
    },
    actions: {
      setPermissionDialogOpen,
      setPermissionToDelete,
      openCreatePermissionDialog,
      openEditPermissionDialog,
      submitPermission,
      confirmDeletePermission,
    },
  };
}
