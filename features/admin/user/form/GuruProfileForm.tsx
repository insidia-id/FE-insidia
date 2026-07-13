import { UseFormReturn } from 'react-hook-form';

import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { CreateUserInput } from '../schema/user.schema';
type Props = {
  form: UseFormReturn<CreateUserInput>;
  index: number;
  isLoadingMitras?: boolean;
};

export function GuruProfileForm({ form, index, isLoadingMitras }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
      <h3 className="text-sm font-medium md:col-span-2">Profile Guru</h3>
      <TextField
        id="user-nip"
        label="NIP"
        placeholder="Nomor Induk Pegawai"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.nip`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.nip`)}
      />
      <TextField
        id="user-subject"
        label="Mata Pelajaran"
        placeholder="Contoh: Matematika"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.subject`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.subject`)}
      />
    </div>
  );
}
