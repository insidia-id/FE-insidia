import { useCreateRole, useDeleteRole, useGetRoles, useUpdateRole } from './use-roles-query';
import { AccessScope } from '../../types/access-control.types';
import { useState, useMemo } from 'react';
import { resolveSelectedRole, resolveSelectedRoleId } from '../../lib/access-control.helper';
import { Role, RoleFormValues } from '../types/role.types';
type UseRolesProps = {
  scope: AccessScope;
  mitraId?: string;
};
export function useRoles({ scope, mitraId }: UseRolesProps) {
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const { data: roles = [], isLoading: rolesLoading, isError: isRolesError, error: rolesError } = useGetRoles(scope, includeDeleted, mitraId);
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

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
  return {
    includeDeleted,
    roles,
    selectedRoleId,
    selectedRole,
    dialogs: {
      roleDialogOpen,
      editingRole,
      roleToDelete,
    },

    queries: {
      rolesLoading,
      isRolesError,
      rolesError: rolesError instanceof Error ? rolesError : null,
    },
    mutations: {
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
    },
  };
}
