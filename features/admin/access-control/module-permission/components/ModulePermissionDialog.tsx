import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, type Resolver, useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextAreaField, TextField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { readErrorMessage } from '@/lib/form/form.helper';
import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';
import { createModulePermissionSchema } from '../schema/module-permission.schema';
import { buildModulePermissionDefaultValues } from '../helper/module-permission.helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AccessScope } from '../../types/access-control.types';
import { ACCESS_SCOPE_OPTIONS } from '../../lib/access-control.helper';

type ModulePermissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modulePermission?: ModulePermission | null;
  isLoading: boolean;
  onSubmit: (values: ModulePermissionFormValues) => void;
};

export function ModulePermissionDialog({ open, onOpenChange, modulePermission, isLoading, onSubmit }: ModulePermissionDialogProps) {
  const form = useForm<ModulePermissionFormValues>({
    resolver: zodResolver(createModulePermissionSchema) as Resolver<ModulePermissionFormValues>,
    defaultValues: buildModulePermissionDefaultValues(modulePermission),
  });

  useEffect(() => {
    form.reset(buildModulePermissionDefaultValues(modulePermission));
  }, [form, modulePermission, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{modulePermission ? 'Edit Module Permission' : 'Tambah Module Permission'}</DialogTitle>
          <DialogDescription>Gunakan nama module yang konsisten agar permission bisa diurutkan dengan jelas.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-4  items-start">
              <div className="flex-1 w-full">
                <TextField id="module-permission-name" label="Nama Module" placeholder="Management User Mitra" error={readErrorMessage(form.formState.errors, 'module')} disabled={isLoading} {...form.register('module')} />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <Label htmlFor="permission-scope">Scope</Label>

                <Controller
                  control={form.control}
                  name="scope"
                  render={({ field }) => (
                    <Select disabled={isLoading} onValueChange={(value) => field.onChange(value as AccessScope)} value={field.value}>
                      <SelectTrigger id="permission-scope" className="w-full">
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
            </div>

            <TextAreaField
              id="module-permission-description"
              label="Deskripsi"
              placeholder="Jelaskan tujuan module ini"
              error={readErrorMessage(form.formState.errors, 'description')}
              disabled={isLoading}
              {...form.register('description')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <LoadingButton type="submit" isLoading={isLoading}>
              {modulePermission ? 'Simpan Perubahan' : 'Simpan Module'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
