import { UseFormReturn } from 'react-hook-form';

import type { UserMitraAssignment } from '../types/user.types';
import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { CreateUserInput } from '../schema/user.schema';
type Props = {
  form: UseFormReturn<CreateUserInput>;
  index: number;
  isLoadingMitras?: boolean;
};

export function WaliMuridProfileForm({ form, index, isLoadingMitras }: Props) {
  return (
    <div className="grid gap-4 border-t pt-4 md:grid-cols-2">
      <h3 className="text-sm font-medium md:col-span-2">Profile Wali Murid</h3>

      <TextField
        label="Pekerjaan"
        id={`user-pekerjaan-${index}`}
        placeholder="Contoh: Pegawai Negeri Sipil"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.pekerjaan`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.pekerjaan`)}
      />

      <TextField
        label="Alamat"
        id={`user-alamat-${index}`}
        placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.alamat`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.alamat`)}
      />
    </div>
  );
}
