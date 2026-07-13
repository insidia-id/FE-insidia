import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, deleteUserMitraRole, getUserById, getUsers, importBulkUsers, previewBulkUsers, switchUserMitra, updateUser } from '../api/api.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import type { UserDetail, UserQueryParams, UserScope, UsersResponse } from '../types/user.types';
import type { BulkImportResult, BulkPreviewResult } from '@/features/bulk/types/bulk.types';
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserQueryParams) => [...userKeys.lists(), { params }] as const,

  detail: (userId: string) => [...userKeys.all, userId] as const,
};
export const useGetUsers = (params: UserQueryParams) =>
  useQuery<UsersResponse>({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    refetchOnWindowFocus: false,
  });

export const useGetUserById = (userId: string, scope: UserScope = 'INSIDIA') =>
  useQuery<UserDetail>({
    queryKey: [...userKeys.detail(userId), { scope }],
    queryFn: () => getUserById(userId, scope),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => {
      return createUser(data);
    },
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
    mutationFn: ({ userId, scope }: { userId: string; scope: UserScope }) => deleteUser(userId, scope),
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

export function useDeleteUserMitraRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, mitraId }: { userId: string; mitraId?: string }) => deleteUserMitraRole(userId, mitraId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      toast.success('Peran Mitra berhasil dihapus dari user');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus peran Mitra dari user'));
    },
  });
}

export function useSwitchUserMitra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { mitraId: string } }) => switchUserMitra(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      toast.success('Berhasil switch Mitra user');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal switch Mitra user'));
    },
  });
}
export function usePreviewBulkUsers() {
  return useMutation<BulkPreviewResult, unknown, File>({
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

  return useMutation<BulkImportResult, unknown, string>({
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
