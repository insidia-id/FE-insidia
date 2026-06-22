import { UseFormReturn } from 'react-hook-form';

import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { CreateUserInput } from '../schema/user.schema';
type Props = {
  form: UseFormReturn<CreateUserInput>;
  index: number;
  isLoadingMitras?: boolean;
};
export function AcademicProfileForm({ form, index, isLoadingMitras }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
      <h3 className="text-sm font-medium md:col-span-2">Profile Akademik</h3>
      <TextField
        id="user-position"
        label="Jabatan"
        placeholder="Contoh: Kepala Sekolah"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.position`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.position`)}
      />
      <TextField
        id="user-division"
        label="Divisi"
        placeholder="Contoh: Administrasi"
        error={readErrorMessage(form.formState.errors, `mitraRoles.${index}.profile.division`)}
        disabled={isLoadingMitras}
        {...form.register(`mitraRoles.${index}.profile.division`)}
      />
    </div>
  );
}
