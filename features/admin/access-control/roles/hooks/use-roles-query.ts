import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { createRole, deleteRole, getRoles, updateRole } from '../api/api.client';
import type { RoleFormValues } from '../types/role.types';
import type { AccessScope } from '../../types/access-control.types';
export const rolesKeys = {
  all: ['roles'] as const,
  lists: (scope: AccessScope, includeDeleted: boolean, mitraId?: string) => [...rolesKeys.all, 'list', scope, includeDeleted, mitraId ?? 'global'] as const,
  byScope: (scope: AccessScope, mitraId?: string) => [...rolesKeys.all, 'list', scope, false, mitraId ?? 'global'] as const,
};
export function useGetRoles(scope: AccessScope, includeDeleted = false, mitraId?: string) {
  return useQuery({
    queryKey: rolesKeys.lists(scope, includeDeleted, mitraId),
    queryFn: () => getRoles(scope, includeDeleted, mitraId),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleFormValues) => createRole(data),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.byScope(role.scope) });
      toast.success('Role berhasil dibuat');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat role'));
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: string; data: RoleFormValues }) => updateRole(roleId, data),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.byScope(role.scope) });
      toast.success('Role berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui role'));
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus role'));
    },
  });
}
