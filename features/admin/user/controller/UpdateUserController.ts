import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDeleteUserMitraRole, useGetUserById, useUpdateUser } from '../hooks/useUser';
import { UpdateUserInput, updateUserSchema } from '../schema/user.schema';
import type { UserDetail, UserScope } from '../types/user.types';
import { getUserScope } from '../HelperUser';

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
  socialLinks: {
    instagram: '',
    linkedin: '',
    github: '',
  },
};

function toUpdateUserFormValues(user: UserDetail, activeScope: UserScope): UpdateUserInput {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? '',
    phone: user.phone ?? '',
    role: user.insidiaRole?.role.code ?? 'USER',
    mitraRole: user.mitraRoles?.role.code as UpdateUserInput['mitraRole'],
    mitraId: user.mitraRoles?.mitraId ?? undefined,
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

  const onDeleteMitraRole = () => {
    deleteUserMitraRoleMutation.mutate(
      { userId, mitraId: user?.mitraRoles?.mitraId },
      {
        onSuccess: () => {
          form.setValue('mitraRole', undefined);
          form.setValue('mitraId', undefined);
        },
      },
    );
  };

  const onSubmit = (values: UpdateUserInput, onSuccess?: (updatedUserId: string) => void) => {
    const { id, ...payload } = values;

    updateUserMutation.mutate(
      {
        userId: id,
        data: payload,
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
  };
}
