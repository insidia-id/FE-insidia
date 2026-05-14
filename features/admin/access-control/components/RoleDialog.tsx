import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type Resolver, useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextAreaField, TextField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { readErrorMessage } from '@/lib/form/form.helper';
import { createRoleSchema, type RoleFormValues } from '../schema/access-control.schema';
import type { AccessScope, Role } from '../types/access-control.types';
import { ACCESS_SCOPE_OPTIONS, buildRoleDefaultValues } from './access-control.helper';

type RoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: AccessScope;
  role?: Role | null;
  isLoading: boolean;
  onSubmit: (values: RoleFormValues) => void;
};

export function RoleDialog({ open, onOpenChange, scope, role, isLoading, onSubmit }: RoleDialogProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(createRoleSchema) as Resolver<RoleFormValues>,
    defaultValues: buildRoleDefaultValues(scope, role),
  });

  useEffect(() => {
    form.reset(buildRoleDefaultValues(scope, role));
  }, [form, role, scope, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Tambah Role'}</DialogTitle>
          <DialogDescription>Gunakan kode role yang konsisten karena backend menyimpan referensi role berdasarkan kode.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField id="role-name" label="Nama Role" placeholder="Admin Cabang" error={readErrorMessage(form.formState.errors, 'name')} disabled={isLoading} {...form.register('name')} />
            <TextField id="role-code" label="Kode Role" placeholder="ADMIN_CABANG" error={readErrorMessage(form.formState.errors, 'code')} disabled={isLoading} {...form.register('code')} />

            <div className="space-y-2">
              <Label htmlFor="role-scope">Scope</Label>
              <Controller
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <Select disabled={isLoading} onValueChange={(value) => field.onChange(value as AccessScope)} value={field.value}>
                    <SelectTrigger id="role-scope">
                      <SelectValue placeholder="Pilih scope" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCESS_SCOPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {readErrorMessage(form.formState.errors, 'scope') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'scope')}</p>}
            </div>

            <div className="flex items-center gap-3 rounded-lg border px-3 py-2 md:mt-7">
              <Controller
                control={form.control}
                name="isSystem"
                render={({ field }) => (
                  <input
                    id="role-is-system"
                    type="checkbox"
                    className="size-4 rounded border-input"
                    checked={field.value}
                    disabled={isLoading}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                )}
              />
              <Label htmlFor="role-is-system" className="cursor-pointer">
                Tandai sebagai role sistem
              </Label>
            </div>

            <div className="md:col-span-2">
              <TextAreaField id="role-description" label="Deskripsi" placeholder="Deskripsikan tanggung jawab role ini" error={readErrorMessage(form.formState.errors, 'description')} disabled={isLoading} {...form.register('description')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <LoadingButton type="submit" isLoading={isLoading}>
              {role ? 'Simpan Perubahan' : 'Simpan Role'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
