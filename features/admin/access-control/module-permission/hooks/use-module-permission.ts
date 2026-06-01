import { useState } from 'react';
import { useCreateModulePermission, useDeleteModulePermission, useGetModulePermissions, useUpdateModulePermission } from './use-module-permission-query';
import type { AccessScope } from '../../types/access-control.types';
import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';

type UseModulePermissionsProps = {
  scope: AccessScope;
  mitraId?: string;
};

export function useModulePermissions({ scope, mitraId }: UseModulePermissionsProps) {
  const [modulePermissionDialogOpen, setModulePermissionDialogOpen] = useState(false);
  const [editingModulePermission, setEditingModulePermission] = useState<ModulePermission | null>(null);
  const [modulePermissionToDelete, setModulePermissionToDelete] = useState<ModulePermission | null>(null);

  const { data: modulePermissions = [], isLoading: modulePermissionsLoading, isError: isModulePermissionsError, error: modulePermissionsError } = useGetModulePermissions(scope, mitraId);
  const createModulePermissionMutation = useCreateModulePermission(scope, mitraId);
  const updateModulePermissionMutation = useUpdateModulePermission(scope, mitraId);
  const deleteModulePermissionMutation = useDeleteModulePermission(scope, mitraId);

  const openCreateModulePermissionDialog = () => {
    setEditingModulePermission(null);
    setModulePermissionDialogOpen(true);
  };

  const openEditModulePermissionDialog = (modulePermission: ModulePermission) => {
    setEditingModulePermission(modulePermission);
    setModulePermissionDialogOpen(true);
  };

  const submitModulePermission = (values: ModulePermissionFormValues) => {
    if (editingModulePermission) {
      updateModulePermissionMutation.mutate(
        {
          modulePermissionId: editingModulePermission.id,
          data: values,
        },
        {
          onSuccess: () => {
            setModulePermissionDialogOpen(false);
            setEditingModulePermission(null);
          },
        },
      );

      return;
    }

    createModulePermissionMutation.mutate(values, {
      onSuccess: () => {
        setModulePermissionDialogOpen(false);
      },
    });
  };

  const confirmDeleteModulePermission = () => {
    if (!modulePermissionToDelete) {
      return;
    }

    deleteModulePermissionMutation.mutate(modulePermissionToDelete.id, {
      onSuccess: () => {
        setModulePermissionToDelete(null);
      },
    });
  };

  return {
    modulePermissions,
    dialogs: {
      modulePermissionDialogOpen,
      editingModulePermission,
      modulePermissionToDelete,
    },
    queries: {
      modulePermissionsLoading,
      isModulePermissionsError,
      modulePermissionsError: modulePermissionsError instanceof Error ? modulePermissionsError : null,
    },
    mutations: {
      createModulePermissionMutation,
      updateModulePermissionMutation,
      deleteModulePermissionMutation,
    },
    actions: {
      setModulePermissionDialogOpen,
      setModulePermissionToDelete,
      openCreateModulePermissionDialog,
      openEditModulePermissionDialog,
      submitModulePermission,
      confirmDeleteModulePermission,
    },
  };
}
