import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMutationErrorMessage } from '@/lib/error/error.message';
import {
  createPermission,
  createRole,
  deletePermission,
  deleteRole,
  getPermissions,
  getRoles,
  replaceRolePermissions,
  updatePermission,
  updateRole,
} from '../api/api.client';
import type { PermissionFormValues, RoleFormValues } from '../schema/access-control.schema';
import type { AccessScope } from '../types/access-control.types';

export const accessControlKeys = {
  rolesByScope: (scope: AccessScope) => ['roles', scope] as const,
  roles: (scope: AccessScope, includeDeleted: boolean) => ['roles', scope, includeDeleted] as const,
  permissions: (scope: AccessScope) => ['permissions', scope] as const,
};

export function useGetRoles(scope: AccessScope, includeDeleted = false) {
  return useQuery({
    queryKey: accessControlKeys.roles(scope, includeDeleted),
    queryFn: () => getRoles(scope, includeDeleted),
  });
}

export function useGetPermissions(scope: AccessScope) {
  return useQuery({
    queryKey: accessControlKeys.permissions(scope),
    queryFn: () => getPermissions(scope),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleFormValues) => createRole(data),
    onSuccess: (role) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.rolesByScope(role.scope) });
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
      queryClient.invalidateQueries({ queryKey: accessControlKeys.rolesByScope(role.scope) });
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
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[]; scope: AccessScope }) => replaceRolePermissions(roleId, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.rolesByScope(variables.scope) });
      queryClient.invalidateQueries({ queryKey: accessControlKeys.permissions(variables.scope) });
      toast.success('Permission role berhasil diperbarui');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal memperbarui permission role'));
    },
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionFormValues) => createPermission(data),
    onSuccess: (permission) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.permissions(permission.scope) });
      toast.success('Permission berhasil dibuat');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal membuat permission'));
    },
  });
}

export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ permissionId, data }: { permissionId: string; data: PermissionFormValues }) => updatePermission(permissionId, data),
    onSuccess: (permission) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.permissions(permission.scope) });
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: accessControlKeys.permissions(variables.scope) });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Permission berhasil dihapus');
    },
    onError: (error) => {
      toast.error(getMutationErrorMessage(error, 'Gagal menghapus permission'));
    },
  });
}
