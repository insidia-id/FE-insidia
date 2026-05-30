'use client';

import { useMemo, useState } from 'react';
import { useCreatePermission, useCreateRole, useDeletePermission, useDeleteRole, useGetPermissions, useGetRoles, useReplaceRolePermissions, useUpdatePermission, useUpdateRole } from '../hooks/useAccessControl';
import type { PermissionFormValues, RoleFormValues } from '../schema/access-control.schema';
import type { AccessScope, Permission, Role } from '../types/access-control.types';
import { filterPermissionsByScope, resolveSelectedPermissionIds, resolveSelectedRole, resolveSelectedRoleId } from '../lib/access-control.helper';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getCurrentUserScope } from '../../user/HelperUser';

type AccessControlPageOptions = {
  mitraId?: string;
};

export function useAccessControlPageController(currentProfile: AuthProfileResponse, options?: AccessControlPageOptions) {
  const { mitraId } = options ?? {};
  const currentUserRole =
    currentProfile?.insidiaRole === 'SUPER_ADMIN' ||
    currentProfile?.insidiaRole === 'ADMIN'
      ? currentProfile.insidiaRole
      : currentProfile?.mitraRoles?.roleCode ?? currentProfile?.insidiaRole ?? null;
  const [scope, setScope] = useState<AccessScope>(() => (mitraId ? 'MITRA' : getCurrentUserScope(currentUserRole)));
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [permissionDraft, setPermissionDraft] = useState<{
    roleId: string | null;
    permissionIds: string[];
  }>({
    roleId: null,
    permissionIds: [],
  });
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const { data: roles = [], isLoading: rolesLoading, isError: isRolesError, error: rolesError } = useGetRoles(scope, includeDeleted, mitraId);
  const { data: permissions = [], isLoading: permissionsLoading, isError: isPermissionsError, error: permissionsError } = useGetPermissions(scope, mitraId);
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const replaceRolePermissionsMutation = useReplaceRolePermissions();
  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const selectedRoleId = useMemo(() => resolveSelectedRoleId(roles, activeRoleId), [activeRoleId, roles]);
  const selectedRole = useMemo(() => resolveSelectedRole(roles, selectedRoleId), [roles, selectedRoleId]);
  const selectedPermissionIds = useMemo(
    () =>
      resolveSelectedPermissionIds({
        permissionDraft,
        selectedRole,
        selectedRoleId,
      }),
    [permissionDraft, selectedRole, selectedRoleId],
  );
  const availablePermissions = useMemo(() => filterPermissionsByScope(permissions, scope), [permissions, scope]);

  const openCreateRoleDialog = () => {
    setEditingRole(null);
    setRoleDialogOpen(true);
  };

  const openEditRoleDialog = (role: Role) => {
    setEditingRole(role);
    setRoleDialogOpen(true);
  };

  const openCreatePermissionDialog = () => {
    setEditingPermission(null);
    setPermissionDialogOpen(true);
  };

  const openEditPermissionDialog = (permission: Permission) => {
    setEditingPermission(permission);
    setPermissionDialogOpen(true);
  };

  const togglePermission = (permissionId: string, checked: boolean) => {
    if (!selectedRoleId) {
      return;
    }

    setPermissionDraft((current) => {
      const currentValues = current.roleId === selectedRoleId ? current.permissionIds : (selectedRole?.permissions.map((item) => item.permissionId) ?? []);
      const nextPermissionIds = checked ? (currentValues.includes(permissionId) ? currentValues : [...currentValues, permissionId]) : currentValues.filter((item) => item !== permissionId);

      return {
        roleId: selectedRoleId,
        permissionIds: nextPermissionIds,
      };
    });
  };

  const syncPermissions = () => {
    if (!selectedRole) {
      return;
    }

    replaceRolePermissionsMutation.mutate({
      roleId: selectedRole.id,
      permissionIds: selectedPermissionIds,
      scope: selectedRole.scope,
      mitraId,
    });
  };

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

  const submitPermission = (values: PermissionFormValues) => {
    if (editingPermission) {
      updatePermissionMutation.mutate(
        {
          permissionId: editingPermission.id,
          data: values,
        },
        {
          onSuccess: () => {
            setPermissionDialogOpen(false);
            setEditingPermission(null);
          },
        },
      );

      return;
    }

    createPermissionMutation.mutate(values, {
      onSuccess: () => {
        setPermissionDialogOpen(false);
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

  const confirmDeletePermission = () => {
    if (!permissionToDelete) {
      return;
    }

    deletePermissionMutation.mutate(
      {
        permissionId: permissionToDelete.id,
        scope: permissionToDelete.scope,
      },
      {
        onSuccess: () => {
          setPermissionToDelete(null);
        },
      },
    );
  };

  return {
    scope,
    includeDeleted,
    scopeLocked: Boolean(mitraId),
    roles,
    permissions,
    selectedRoleId,
    selectedRole,
    selectedPermissionIds,
    availablePermissions,
    dialogs: {
      roleDialogOpen,
      permissionDialogOpen,
      editingRole,
      editingPermission,
      roleToDelete,
      permissionToDelete,
    },
    queries: {
      rolesLoading,
      permissionsLoading,
      isRolesError,
      isPermissionsError,
      rolesError: rolesError instanceof Error ? rolesError : null,
      permissionsError: permissionsError instanceof Error ? permissionsError : null,
    },
    mutations: {
      createRoleMutation,
      updateRoleMutation,
      deleteRoleMutation,
      replaceRolePermissionsMutation,
      createPermissionMutation,
      updatePermissionMutation,
      deletePermissionMutation,
    },
    actions: {
      setScope,
      setIncludeDeleted,
      setActiveRoleId,
      setRoleDialogOpen,
      setPermissionDialogOpen,
      setRoleToDelete,
      setPermissionToDelete,
      openCreateRoleDialog,
      openEditRoleDialog,
      openCreatePermissionDialog,
      openEditPermissionDialog,
      togglePermission,
      syncPermissions,
      submitRole,
      submitPermission,
      confirmDeleteRole,
      confirmDeletePermission,
    },
  };
}
