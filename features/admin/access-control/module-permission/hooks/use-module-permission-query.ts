import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { createModulePermission, deleteModulePermission, getModulePermissions, importBulkModulesPermission, previewBulkModulesPermission, updateModulePermission } from '../api/api.client';
import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';
import { BulkImportResult, BulkPreviewResult } from '@/features/bulk/types/bulk.types';
import { AccessScope } from '@/lib/types/types';
export const modulePermissionKeys = {
  all: ['module-permissions'] as const,
  lists: (scope: AccessScope, mitraId?: string) => [...modulePermissionKeys.all, 'list', scope, mitraId ?? 'INSIDIA'] as const,
};

export function useGetModulePermissions(scope: AccessScope, mitraId?: string) {
  return useQuery({
    queryKey: modulePermissionKeys.lists(scope, mitraId),
    queryFn: () => getModulePermissions(scope, mitraId),
  });
}

export function useCreateModulePermission(scope: AccessScope, mitraId?: string) {
  const queryClient = useQueryClient();
  const listKey = modulePermissionKeys.lists(scope, mitraId);

  return useMutation({
    mutationFn: (data: ModulePermissionFormValues) => createModulePermission(data),
    onSuccess: (modulePermission: ModulePermission) => {
      queryClient.setQueryData<ModulePermission[]>(listKey, (current) => {
        const items = Array.isArray(current) ? current : [];
        return [modulePermission, ...items.filter((item) => item.id !== modulePermission.id)];
      });
      queryClient.invalidateQueries({ queryKey: listKey });
      toast.success('Module permission berhasil dibuat');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat module permission'));
    },
  });
}

export function useUpdateModulePermission(scope: AccessScope, mitraId?: string) {
  const queryClient = useQueryClient();
  const listKey = modulePermissionKeys.lists(scope, mitraId);

  return useMutation({
    mutationFn: ({ modulePermissionId, data }: { modulePermissionId: string; data: ModulePermissionFormValues }) => updateModulePermission(modulePermissionId, data),
    onSuccess: (modulePermission) => {
      queryClient.setQueryData<ModulePermission[]>(listKey, (current) => {
        const items = Array.isArray(current) ? current : [];
        return items.map((item) => (item.id === modulePermission.id ? modulePermission : item));
      });
      queryClient.invalidateQueries({ queryKey: listKey });
      toast.success('Module permission berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui module permission'));
    },
  });
}

export function useDeleteModulePermission(scope: AccessScope, mitraId?: string) {
  const queryClient = useQueryClient();
  const listKey = modulePermissionKeys.lists(scope, mitraId);

  return useMutation({
    mutationFn: (modulePermissionId: string) => deleteModulePermission(modulePermissionId),
    onSuccess: (_, modulePermissionId) => {
      queryClient.setQueryData<ModulePermission[]>(listKey, (current) => {
        const items = Array.isArray(current) ? current : [];
        return items.filter((item) => item.id !== modulePermissionId);
      });
      queryClient.invalidateQueries({ queryKey: listKey });
      toast.success('Module permission berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus module permission'));
    },
  });
}
export function usePreviewBulkModulesPermission() {
  return useMutation<BulkPreviewResult, unknown, File>({
    mutationFn: (file: File) => previewBulkModulesPermission(file),
    onSuccess: (result) => {
      if (result.canImport) {
        toast.success('Preview bulk upload berhasil');
        return;
      }

      toast.error('Masih ada data CSV yang tidak valid');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memproses preview bulk upload'));
    },
  });
}

export function useImportBulkModulesPermission() {
  const queryClient = useQueryClient();

  return useMutation<BulkImportResult, unknown, string>({
    mutationFn: (jobId: string) => importBulkModulesPermission(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modulePermissionKeys.all });
      toast.success('Import bulk module permission berhasil diantrikan');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memulai import bulk module permission'));
    },
  });
}
