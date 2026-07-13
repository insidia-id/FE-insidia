import { memo } from 'react';
import { useWatch, UseFormReturn } from 'react-hook-form';

import { ProfileFieldsRenderer } from './ProfileForm';

import type { MitraRole } from '../types/user.types';
import { CreateUserInput } from '../schema/user.schema';

type Props = {
  form: UseFormReturn<CreateUserInput>;
  index: number;
  isLoadingMitras?: boolean;
};

export const MitraRoleRow = memo(({ form, index, isLoadingMitras }: Props) => {
  const role = useWatch({
    control: form.control,
    name: `mitraRoles.${index}.roleCode`,
  }) as MitraRole | undefined;
  return <ProfileFieldsRenderer form={form} index={index} role={role} isLoadingMitras={isLoadingMitras} />;
});

MitraRoleRow.displayName = 'MitraRoleRow';
