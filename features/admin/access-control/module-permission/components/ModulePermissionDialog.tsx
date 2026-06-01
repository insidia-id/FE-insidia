import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Resolver, useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextAreaField, TextField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { readErrorMessage } from '@/lib/form/form.helper';
import type { ModulePermission, ModulePermissionFormValues } from '../types/module-permission.types';
import { createModulePermissionSchema } from '../schema/module-permission.schema';
import { buildModulePermissionDefaultValues } from '../helper/module-permission.helper';

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
            <TextField id="module-permission-name" label="Nama Module" placeholder="User Management" error={readErrorMessage(form.formState.errors, 'module')} disabled={isLoading} {...form.register('module')} />
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
