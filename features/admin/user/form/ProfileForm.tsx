import { UseFormReturn } from 'react-hook-form';

import { MuridProfileForm } from './MuridProfileForm';
import { GuruProfileForm } from './GuruProfileForm';
import { AcademicProfileForm } from './AcademicProfileForm';
import { WaliMuridProfileForm } from './WaliMuridProfileForm';

import type { MitraRole } from '../types/user.types';
import { CreateUserInput } from '../schema/user.schema';

type Props = {
  form: UseFormReturn<CreateUserInput>;
  index: number;
  role?: MitraRole;
  isLoadingMitras?: boolean;
};

export function ProfileFieldsRenderer({ role, form, index, isLoadingMitras }: Props) {
  switch (role) {
    case 'MURID':
      return <MuridProfileForm form={form} index={index} isLoadingMitras={isLoadingMitras} />;

    case 'GURU':
      return <GuruProfileForm form={form} index={index} isLoadingMitras={isLoadingMitras} />;

    case 'AKADEMIK':
      return <AcademicProfileForm form={form} index={index} isLoadingMitras={isLoadingMitras} />;

    case 'WALI_MURID':
      return <WaliMuridProfileForm form={form} index={index} isLoadingMitras={isLoadingMitras} />;

    default:
      return null;
  }
}
