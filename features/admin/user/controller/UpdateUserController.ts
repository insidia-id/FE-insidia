import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useGetUserById, useUpdateUser } from '../hooks/useUser';
import { UpdateUserInput, updateUserSchema } from '../schema/user.schema';

const defaultValues: UpdateUserInput = {
  id: '',
  email: '',
  name: '',
  phone: '',
  role: 'USER_BIASA',
  status: 'ACTIVE',
  bio: '',
  headline: '',
  websiteUrl: '',
  socialLinks: {
    instagram: '',
    linkedin: '',
    github: '',
  },
};

export function UpdateUserController(userId: string) {
  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema) as Resolver<UpdateUserInput>,
    defaultValues: {
      ...defaultValues,
      id: userId,
    },
  });

  const { data: user, isLoading, isError, error } = useGetUserById(userId);
  const updateUserMutation = useUpdateUser();
  useEffect(() => {
    if (!user) return;

    form.reset({
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      phone: user.phone ?? '',
      role: user.role,
      status: user.status,
      bio: user.bio ?? '',
      headline: user.headline ?? '',
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
            role: updatedUser.role,
            status: updatedUser.status,
            bio: updatedUser.bio ?? '',
            headline: updatedUser.headline ?? '',
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
