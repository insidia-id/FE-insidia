import { UseFormReturn } from 'react-hook-form';
import { readErrorMessage } from '@/lib/form/form.helper';

import type { UserMitraAssignment } from '../types/user.types';
import { TextField } from '@/components/common/form';
import { CreateUserInput } from '../schema/user.schema';
type Props = {
  form: UseFormReturn<CreateUserInput>;
  index: number;
  isLoadingMitras?: boolean;
};

export function MuridProfileForm({ form, index, isLoadingMitras }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
      <h3 className="text-sm font-medium md:col-span-2">Profile Murid</h3>

      <TextField
        id={`user-nis-${index}`}
        label="NIS"
        placeholder="Nomor Induk Siswa"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.nis`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.nis`)}
      />

      <TextField
        id={`user-kelas-${index}`}
        label="Kelas"
        placeholder="Contoh: 12 IPA 1"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.kelas`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.kelas`)}
      />

      <TextField
        id={`user-jurusan-${index}`}
        label="Jurusan"
        placeholder="Contoh: IPA"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.jurusan`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.jurusan`)}
      />
    </div>
  );
}
