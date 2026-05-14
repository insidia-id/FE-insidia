import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../api/api.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import type { User, UserDetail, UserFilter, UserScope } from '../types/user.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filter: UserFilter = 'available', scope: UserScope = 'PLATFORM') => [...userKeys.lists(), { filter, scope }] as const,

  detail: (userId: string) => [...userKeys.all, userId] as const,
};
export const useGetUsers = (filter: UserFilter = 'available', scope: UserScope = 'PLATFORM') =>
  useQuery<User[]>({
    queryKey: userKeys.list(filter, scope),
    queryFn: () => getUsers(filter, scope),
    refetchOnWindowFocus: false,
  });

export const useGetUserById = (userId: string, scope: UserScope = 'PLATFORM') =>
  useQuery<UserDetail>({
    queryKey: [...userKeys.detail(userId), { scope }],
    queryFn: () => getUserById(userId, scope),
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
