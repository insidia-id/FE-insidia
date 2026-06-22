import { Controller, Path, UseFormReturn, useFieldArray } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { readErrorMessage } from '@/lib/form/form.helper';
import { MitrasController } from '../../mitras/controller/MitrasController';
import { Combobox } from '@/components/common/Combobox';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { Button } from '@/components/ui/button';
import type { MitraRole, UserMitraAssignment } from '../types/user.types';
import { createProfileByRole } from '../HelperUser';
import { MitraRoleRow } from './MitraRoleRow';
import { useEffect } from 'react';
import { CreateUserInput } from '../schema/user.schema';

type RoleOption = {
  label: string;
  value: 'AKADEMIK' | 'MURID' | 'GURU' | 'WALI_MURID';
};

type Props = {
  form: UseFormReturn<CreateUserInput>;
  roleOptions: RoleOption[];
  currentUserRole?: string | null;
  onDeleteMitraRole?: (mitraId?: string) => void;
  isDeletingMitraRole?: boolean;
  deletingMitraId?: string | null;
  role?: MitraRole;
};

export const MitraCardForm = ({ form, roleOptions, currentUserRole, onDeleteMitraRole, isDeletingMitraRole = false, deletingMitraId = null, role }: Props) => {
  const { mitraOptions, setMitraQuery, isLoading: isLoadingMitras } = MitrasController();

  const mitraRolesError = readErrorMessage(form.formState.errors, 'mitraRoles');
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'mitraRoles',
  });
  const handleRemove = (index: number) => {
    remove(index);

    const current = form.getValues('mitraRoles');

    if (current && current.length <= 1) {
      form.setValue('scope', 'INSIDIA');
    }
  };
  const createMitraAssignment = (role: MitraRole): UserMitraAssignment => ({
    mitraId: '',
    mitraName: '',
    mitraSlug: '',
    roleCode: role,
    profile: createProfileByRole(role),
  });
  const handleAddMitra = (role: MitraRole) => {
    append(createMitraAssignment(role));
    form.setValue(`scope`, 'MITRA', { shouldDirty: true, shouldTouch: true });
  };

  console.log(`Mitra Roles form watch: ${JSON.stringify(form.watch('mitraRoles'))}`);
  console.log(`Mitra Roles form values: ${JSON.stringify(form.getValues())}`);
  return (
    <section className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Penugasan Mitra</h3>
          {currentUserRole === 'SUPER_ADMIN' && <p className="text-sm text-muted-foreground">User bisa memiliki lebih dari satu mitra dengan role yang berbeda.</p>}
        </div>
        <Button type="button" onClick={() => handleAddMitra('AKADEMIK')}>
          + Tambah Penugasan
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
          <p className="text-sm font-medium">Belum ada penugasan mitra</p>
          <p className="mt-1 text-sm text-muted-foreground">Klik tambah penugasan untuk memberikan akses mitra kepada user.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const item = field as typeof field & {
              mitraId?: string;
              mitraName?: string;
              mitraSlug?: string;
            };
            return (
              <div key={item.id} className="space-y-4 rounded-xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Penugasan Mitra </p>
                    {currentUserRole === 'SUPER_ADMIN' && <p className="text-xs text-muted-foreground">Ubah mitra atau role untuk penugasan ini.</p>}
                  </div>

                  {item.mitraId && onDeleteMitraRole ? (
                    <LoadingButton isLoading={isDeletingMitraRole && deletingMitraId === item.mitraId} type="button" variant="destructive" size="sm" onClick={() => onDeleteMitraRole(item.mitraId)}>
                      Hapus
                    </LoadingButton>
                  ) : (
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemove(index)}>
                      Hapus
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentUserRole === 'SUPER_ADMIN' && (
                    <div className="space-y-2">
                      <Label>Mitra</Label>

                      <Controller
                        control={control}
                        name={`mitraRoles.${index}.mitraId`}
                        render={({ field }) => (
                          <Combobox
                            data={mitraOptions}
                            value={field.value || undefined}
                            onChange={(value) => {
                              field.onChange(value);

                              const selectedMitra = mitraOptions.find((mitra) => mitra.value === value);

                              form.setValue(`mitraRoles.${index}.mitraName`, selectedMitra?.label ?? '', {
                                shouldDirty: true,
                                shouldTouch: true,
                              });
                              form.setValue(`mitraRoles.${index}.mitraSlug`, selectedMitra?.meta?.slug ?? '', {
                                shouldDirty: true,
                                shouldTouch: true,
                              });
                            }}
                            placeholder="Cari dan pilih mitra"
                            disabled={isLoadingMitras}
                            onSearch={setMitraQuery}
                          />
                        )}
                      />

                      {readErrorMessage(form.formState.errors, `mitraRoles.${index}.mitraId`) && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, `mitraRoles.${index}.mitraId`)}</p>}
                    </div>
                  )}

                  {currentUserRole !== 'SUPER_ADMIN' && (
                    <div className="space-y-2">
                      <Label>Mitra</Label>
                      <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-foreground">{item.mitraName || item.mitraSlug || item.mitraId || 'Mitra belum dipilih'}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Role Mitra</Label>

                    <Controller
                      control={control}
                      name={`mitraRoles.${index}.roleCode`}
                      render={({ field }) => (
                        <Select
                          disabled={isLoadingMitras}
                          value={field.value}
                          onValueChange={(role) => {
                            field.onChange(role);

                            form.setValue(`mitraRoles.${index}.profile`, createProfileByRole(role as MitraRole));
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih role mitra" />
                          </SelectTrigger>

                          <SelectContent>
                            {roleOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {readErrorMessage(form.formState.errors, `mitraRoles.${index}.roleCode`) && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, `mitraRoles.${index}.roleCode`)}</p>}
                  </div>
                </div>
                <MitraRoleRow form={form} index={index} isLoadingMitras={isLoadingMitras} />
              </div>
            );
          })}
        </div>
      )}

      {mitraRolesError && <p className="text-sm text-destructive">{mitraRolesError}</p>}
    </section>
  );
};
