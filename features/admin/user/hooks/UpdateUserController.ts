import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDeleteUserMitraRole, useGetUserById, useUpdateUser } from '../hooks/useUser';
import { UpdateUserInput, updateUserSchema } from '../schema/user.schema';
import type { UserDetail, UserScope } from '../types/user.types';
import { getUserScope, toUserMitraAssignments } from '../HelperUser';
const defaultValues: UpdateUserInput = {
  id: '',
  email: '',
  name: '',
  phone: '',
  role: 'USER',
  scope: 'INSIDIA',
  status: 'ACTIVE',
  bio: '',
  websiteUrl: '',
  mitraRoles: [],
  socialLinks: {
    instagram: '',
    linkedin: '',
    github: '',
  },
};

function toUpdateUserFormValues(user: UserDetail, activeScope: UserScope): UpdateUserInput {
  const mitraAssignments = toUserMitraAssignments(user.mitraRoles);
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? '',
    phone: user.phone ?? '',
    role: user.insidiaRole?.role.code ?? 'USER',
    mitraRoles: mitraAssignments,
    scope: getUserScope(activeScope),
    status: user.status,
    bio: user.bio ?? '',
    websiteUrl: user.websiteUrl ?? '',
    socialLinks: {
      instagram: user.socialLinks?.instagram ?? '',
      linkedin: user.socialLinks?.linkedin ?? '',
      github: user.socialLinks?.github ?? '',
    },
  };
}

export function UpdateUserController(userId: string, scope: UserScope = 'INSIDIA') {
  const [deletingMitraId, setDeletingMitraId] = useState<string | null>(null);
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema) as Resolver<UpdateUserInput>,
    defaultValues: {
      ...defaultValues,
      id: userId,
    },
  });
  const { data: user, isLoading, isError, error } = useGetUserById(userId, scope);
  const updateUserMutation = useUpdateUser();
  const deleteUserMitraRoleMutation = useDeleteUserMitraRole();

  useEffect(() => {
    if (!user) return;

    form.reset(toUpdateUserFormValues(user, scope));
  }, [form, user, scope]);

  const onDeleteMitraRole = (mitraId?: string) => {
    if (!mitraId) {
      const currentAssignments = form.getValues('mitraRoles') ?? [];
      form.setValue(
        'mitraRoles',
        currentAssignments.filter((assignment) => assignment.mitraId !== mitraId),
        { shouldDirty: true, shouldTouch: true },
      );
      return;
    }

    setDeletingMitraId(mitraId);
    deleteUserMitraRoleMutation.mutate(
      { userId, mitraId },
      {
        onSuccess: () => {
          const currentAssignments = form.getValues('mitraRoles') ?? [];
          form.setValue(
            'mitraRoles',
            currentAssignments.filter((assignment) => assignment.mitraId !== mitraId),
            { shouldDirty: true, shouldTouch: true },
          );
        },
        onSettled: () => setDeletingMitraId(null),
      },
    );
  };

  const onSubmit = (values: UpdateUserInput, onSuccess?: (updatedUserId: string) => void) => {
    const { id, mitraRoles = [], ...payload } = values;
    const isMitraScoped = values.scope === 'MITRA' || mitraRoles.length > 0;
    updateUserMutation.mutate(
      {
        userId: id,
        data: {
          ...payload,
          role: isMitraScoped ? 'USER' : payload.role,
          scope: isMitraScoped ? 'MITRA' : values.scope,
          mitraRoles,
        },
      },
      {
        onSuccess: (updatedUser) => {
          form.reset(toUpdateUserFormValues(updatedUser, scope));

          onSuccess?.(updatedUser.id);
        },
      },
    );
  };

  return {
    form,
    user,
    isLoading,
    isError,
    error,
    isSubmitting: updateUserMutation.isPending,
    onSubmit,
    onDeleteMitraRole,
    isDeletingMitraRole: deleteUserMitraRoleMutation.isPending,
    deletingMitraId,
  };
}
