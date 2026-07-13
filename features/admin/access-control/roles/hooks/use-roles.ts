import { useCreateRole, useDeleteRole, useGetRolePermissions, useGetRoles, useReplaceRolePermissions, useUpdateRole } from './use-roles-query';
import { AccessScope } from '../../types/access-control.types';
import { useState, useMemo, useEffect } from 'react';
import { resolveSelectedPermissionIds, resolveSelectedRole, resolveSelectedRoleId } from '../../lib/access-control.helper';
import { Role, RoleFormValues } from '../types/role.types';
import { UserScope } from '@/features/admin/user/types/user.types';
type UseRolesProps = {
  scope: AccessScope;
  mitraId?: string | null;
};
type PermissionDraft = {
  scope: UserScope;
  mitraId?: string | null;
  roleId: string | null;
  permissionIds: string[];
};
export function useRoles({ scope, mitraId }: UseRolesProps) {
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<PermissionDraft>({
    scope,
    mitraId,
    roleId: null,
    permissionIds: [],
  });
  const { data: roles = [], isLoading: rolesLoading, isError: isRolesError, error: rolesError } = useGetRoles(scope, includeDeleted, mitraId);

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const replaceRolePermissionsMutation = useReplaceRolePermissions();
  const openCreateRoleDialog = () => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  };
  const selectedRoleId = useMemo(() => resolveSelectedRoleId(roles, activeRoleId), [activeRoleId, roles]);
  const selectedRole = useMemo(() => resolveSelectedRole(roles, selectedRoleId), [roles, selectedRoleId]);

  const {
    data: rolePermissions = [],
    isLoading: rolePermissionsLoading,
    isError: isRolePermissionsError,
    error: rolePermissionsError,
  } = useGetRolePermissions(scope, selectedRoleId ?? activeRoleId, mitraId, { enabled: !!selectedRoleId || !!activeRoleId });

  const submitRole = (values: RoleFormValues) => {
    if (editingRole) {
      updateRoleMutation.mutate(
        {
          roleId: editingRole.id,
          data: values,
        },
        {
          onSuccess: () => {
            setRoleDialogOpen(false);
            setEditingRole(null);
          },
        },
      );

      return;
    }

    createRoleMutation.mutate(values, {
      onSuccess: () => {
        setRoleDialogOpen(false);
      },
    });
  };
  const confirmDeleteRole = () => {
    if (!roleToDelete) {
      return;
    }

    deleteRoleMutation.mutate(roleToDelete.id, {
      onSuccess: () => {
        setRoleToDelete(null);
      },
    });
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
    if (!selectedRoleId) {
      return;
    }

    setPermissionDraft((current) => {
      const isSameContext = current.scope === scope && current.mitraId === mitraId && current.roleId === selectedRoleId;

      const currentValues = isSameContext ? current.permissionIds : (rolePermissions?.map((item) => item.permissionId) ?? []);

      const nextPermissionIds = checked ? (currentValues.includes(permissionId) ? currentValues : [...currentValues, permissionId]) : currentValues.filter((item) => item !== permissionId);

      return {
        roleId: selectedRoleId,
        permissionIds: nextPermissionIds,
        scope,
        mitraId,
      };
    });
  };

  const selectedPermissionIds = useMemo(
    () =>
      resolveSelectedPermissionIds({
        permissionDraft,
        selectedRoleId,
        rolePermissions,
        scope,
        mitraId,
      }),
    [permissionDraft, selectedRoleId, rolePermissions, scope, mitraId],
  );

  const syncPermissions = () => {
    if (!selectedRole) {
      return;
    }

    replaceRolePermissionsMutation.mutate({
      roleId: selectedRole.id,
      permissionIds: selectedPermissionIds,
      scope: selectedRole.scope,
      mitraId: mitraId ?? undefined,
    });
  };

  return {
    includeDeleted,
    roles,
    selectedRoleId,
    selectedRole,
    selectedPermissionIds,
    activeRoleId,
    permissions: rolePermissions,
    dialogs: {
      roleDialogOpen,
      editingRole,
      roleToDelete,
    },

    queries: {
      rolesLoading,
      isRolesError,
      rolesError: rolesError instanceof Error ? rolesError : null,
      rolePermissionsLoading,
      isRolePermissionsError,
      rolePermissionsError: rolePermissionsError instanceof Error ? rolePermissionsError : null,
    },
    mutations: {
      replaceRolePermissionsMutation,
      createRoleMutation,
      updateRoleMutation,
      deleteRoleMutation,
    },
    actions: {
      setIncludeDeleted,
      setActiveRoleId,
      setRoleDialogOpen,
      setRoleToDelete,
      openCreateRoleDialog,
      openEditRoleDialog,
      submitRole,
      confirmDeleteRole,
      syncPermissions,
      togglePermission,
    },
  };
}
