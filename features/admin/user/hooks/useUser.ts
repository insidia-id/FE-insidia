import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, getUserById, getUsers, importBulkUsers, previewBulkUsers, updateUser } from '../api/api.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import type { BulkUserImportResult, BulkUserPreviewResult, User, UserDetail, UserFilter, UserScope } from '../types/user.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filter: UserFilter = 'available', scope: UserScope = 'INSIDIA', mitraId?: string) => [...userKeys.lists(), { filter, scope, mitraId }] as const,

  detail: (userId: string) => [...userKeys.all, userId] as const,
};
export const useGetUsers = (filter: UserFilter = 'available', scope: UserScope = 'INSIDIA', mitraId?: string) =>
  useQuery<User[]>({
    queryKey: userKeys.list(filter, scope, mitraId),
    queryFn: () => getUsers(filter, scope, mitraId),
    refetchOnWindowFocus: false,
  });

export const useGetUserById = (userId: string, scope: UserScope = 'INSIDIA', mitraId?: string) =>
  useQuery<UserDetail>({
    queryKey: [...userKeys.detail(userId), { scope, mitraId }],
    queryFn: () => getUserById(userId, scope, mitraId),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User berhasil dibuat');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat user'));
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserPayload }) => updateUser(userId, data),

    onSuccess: (_, variables) => {
      toast.success('User Berhasil diperbarui');

      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.userId),
      });
    },

    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui user'));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, scope, mitraId }: { userId: string; scope: UserScope; mitraId?: string }) => deleteUser(userId, scope, mitraId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.removeQueries({ queryKey: userKeys.detail(variables.userId) });
      toast.success('User berhasil dihapus');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus user'));
    },
  });
}

export function usePreviewBulkUsers() {
  return useMutation<BulkUserPreviewResult, unknown, File>({
    mutationFn: (file: File) => previewBulkUsers(file),
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

export function useImportBulkUsers() {
  const queryClient = useQueryClient();

  return useMutation<BulkUserImportResult, unknown, string>({
    mutationFn: (jobId: string) => importBulkUsers(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Import bulk user berhasil diantrikan');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memulai import bulk user'));
    },
  });
}
