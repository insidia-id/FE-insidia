import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { createPermission, deletePermission, updatePermission } from '../api/api.client';
import type { PermissionFormValues } from '../types/permission.types';
import type { AccessScope } from '../../types/access-control.types';
import { rolesKeys } from '../../roles/hooks/use-roles-query';
import { replaceRolePermissions } from '../../api/api.client';
import { modulePermissionKeys } from '../../module-permission/hooks/use-module-permission-query';

const invalidateModulePermissions = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: modulePermissionKeys.all });
};

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionFormValues) => createPermission(data),
    onSuccess: () => {
      invalidateModulePermissions(queryClient);
      toast.success('Permission berhasil dibuat');
    },
    onError: (error) => {
      console.error('Create Permission Error:', error);
      toast.error(getMutationErrorMessage(error, 'Gagal membuat permission'));
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string; data: PermissionFormValues }) => updatePermission(permissionId, data),
    onSuccess: () => {
      invalidateModulePermissions(queryClient);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Permission berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui permission'));
    },
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permissionId }: { permissionId: string; scope: AccessScope }) => deletePermission(permissionId),
    onSuccess: () => {
      invalidateModulePermissions(queryClient);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Permission berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus permission'));
    },
  });
}
export function useReplaceRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds, mitraId }: { roleId: string; permissionIds: string[]; scope: AccessScope; mitraId?: string }) => replaceRolePermissions(roleId, permissionIds, mitraId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.byScope(variables.scope, variables.mitraId) });
      toast.success('Permission role berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui permission role'));
    },
  });
}
