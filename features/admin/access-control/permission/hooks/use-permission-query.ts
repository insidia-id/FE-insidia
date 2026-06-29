import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { createPermission, deletePermission, updatePermission } from '../api/api.client';
import type { PermissionFormValues } from '../types/permission.types';
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
    mutationFn: ({ permissionId }: { permissionId: string }) => deletePermission(permissionId),
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
