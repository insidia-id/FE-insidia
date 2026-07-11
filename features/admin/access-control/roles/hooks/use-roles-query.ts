import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import { createRole, deleteRole, getMitraRolePermissions, getRolePermissions, getRoles, replaceMitraRolePermissions, replaceRolePermissions, updateRole } from '../api/api.client';
import type { RoleFormValues } from '../types/role.types';
import type { AccessScope } from '../../types/access-control.types';

type UseGetRolesOptions = {
  enabled?: boolean;
};

export const rolesKeys = {
  all: ['roles'] as const,
  lists: (scope: AccessScope, includeDeleted: boolean, mitraId?: string | null) => [...rolesKeys.all, 'list', scope, includeDeleted, mitraId ?? 'global'] as const,
  byScope: (scope: AccessScope) => [...rolesKeys.all, 'list', scope, false] as const,
};

export function useGetRoles(scope: AccessScope, includeDeleted = false, mitraId?: string | null) {
  return useQuery({
    queryKey: rolesKeys.lists(scope, includeDeleted, mitraId),
    queryFn: () => getRoles(scope, includeDeleted, mitraId ?? undefined),
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

export function useReplaceRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds, scope, mitraId }: { roleId: string; permissionIds: string[]; scope: AccessScope; mitraId?: string }) => {
      if (scope === 'INSIDIA') {
        return replaceRolePermissions(roleId, permissionIds);
      }

      if (!mitraId) {
        throw new Error('untuk scope MITRA, Mitra harus Dipilih');
      }

      return replaceMitraRolePermissions(roleId, permissionIds, mitraId);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: rolesKeys.byScope(variables.scope),
      });

      toast.success('Permission role berhasil diperbarui');
    },

    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui permission role'));
    },
  });
}

export function useGetRolePermissions(scope: AccessScope, roleId: string, mitraId?: string | null, options?: UseGetRolesOptions) {
  return useQuery({
    queryKey: ['roles', roleId, 'permissions', 'mitras', mitraId],
    queryFn: () => {
      if (scope === 'INSIDIA') {
        return getRolePermissions(roleId!);
      }
      return getMitraRolePermissions(roleId!, mitraId!);
    },
    enabled: options?.enabled ?? true,
  });
}
