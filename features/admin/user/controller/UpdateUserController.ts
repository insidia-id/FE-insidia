import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useGetUserById, useUpdateUser } from '../hooks/useUser';
import { UpdateUserInput, updateUserSchema } from '../schema/user.schema';
import type { UserScope } from '../types/user.types';
import { getUserRole, getUserScope } from '../components/HelperUser';

const defaultValues: UpdateUserInput = {
  id: '',
  email: '',
  name: '',
  phone: '',
  role: 'USER',
  scope: 'PLATFORM',
  status: 'ACTIVE',
  bio: '',
  websiteUrl: '',
  socialLinks: {
    instagram: '',
    linkedin: '',
    github: '',
  },
};

export function UpdateUserController(userId: string, scope: UserScope = 'PLATFORM') {
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema) as Resolver<UpdateUserInput>,
    defaultValues: {
      ...defaultValues,
      id: userId,
    },
  });

  const { data: user, isLoading, isError, error } = useGetUserById(userId, scope);
  const updateUserMutation = useUpdateUser();
  useEffect(() => {
    if (!user) return;

    form.reset({
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      phone: user.phone ?? '',
      role: getUserRole(user),
      scope: getUserScope(user),
      status: user.status,
      bio: user.bio ?? '',
      websiteUrl: user.websiteUrl ?? '',
      socialLinks: {
        instagram: user.socialLinks?.instagram ?? '',
        linkedin: user.socialLinks?.linkedin ?? '',
        github: user.socialLinks?.github ?? '',
      },
    });
  }, [form, user]);

  const onSubmit = (values: UpdateUserInput, onSuccess?: (updatedUserId: string) => void) => {
    const { id, ...payload } = values;

    updateUserMutation.mutate(
      {
        userId: id,
        data: payload,
      },
      {
        onSuccess: (updatedUser) => {
          form.reset({
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name ?? '',
            phone: updatedUser.phone ?? '',
            role: getUserRole(updatedUser),
            scope: getUserScope(updatedUser),
            status: updatedUser.status,
            bio: updatedUser.bio ?? '',
            websiteUrl: updatedUser.websiteUrl ?? '',
            socialLinks: {
              instagram: updatedUser.socialLinks?.instagram ?? '',
              linkedin: updatedUser.socialLinks?.linkedin ?? '',
              github: updatedUser.socialLinks?.github ?? '',
            },
          });

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
  };
}
