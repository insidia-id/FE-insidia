import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../api/api.client';
import { CreateUserInput, UpdateUserPayload } from '../schema/user.schema';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import type { User, UserDetail, UserFilter } from '../types/user.types';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filter: UserFilter = 'active') => [...userKeys.lists(), { filter }] as const,

  detail: (userId: string) => [...userKeys.all, userId] as const,
};
export const useGetUsers = (filter: UserFilter = 'active') =>
  useQuery<User[]>({
    queryKey: userKeys.list(filter),
    queryFn: () => getUsers(filter),
    refetchOnWindowFocus: false,
  });

export const useGetUserById = (userId: string) =>
  useQuery<UserDetail>({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User created successfully');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Failed to create user'));
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
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.setQueryData<User[]>(userKeys.all, (currentUsers) => currentUsers?.filter((user) => user.id !== userId) ?? []);
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });
      toast.success('User berhasil dihapus');
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus user'));
    },
  });
}
