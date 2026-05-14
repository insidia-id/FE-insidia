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
import { createPermissionSchema, type PermissionFormValues } from '../schema/access-control.schema';
import type { AccessScope, Permission } from '../types/access-control.types';
import { ACCESS_SCOPE_OPTIONS, buildPermissionDefaultValues } from './access-control.helper';

type PermissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: AccessScope;
  permission?: Permission | null;
  isLoading: boolean;
  onSubmit: (values: PermissionFormValues) => void;
};

export function PermissionDialog({ open, onOpenChange, scope, permission, isLoading, onSubmit }: PermissionDialogProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(createPermissionSchema) as Resolver<PermissionFormValues>,
    defaultValues: buildPermissionDefaultValues(scope, permission),
  });

  useEffect(() => {
    form.reset(buildPermissionDefaultValues(scope, permission));
  }, [form, permission, scope, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{permission ? 'Edit Permission' : 'Tambah Permission'}</DialogTitle>
          <DialogDescription>Kode permission dibentuk di backend dari nama permission. Pastikan nama finalnya sudah benar.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <TextField id="permission-name" label="Nama Permission" placeholder="User Create Platform All" error={readErrorMessage(form.formState.errors, 'name')} disabled={isLoading} {...form.register('name')} />

            <div className="space-y-2">
              <Label htmlFor="permission-scope">Scope</Label>
              <Controller
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <Select disabled={isLoading} onValueChange={(value) => field.onChange(value as AccessScope)} value={field.value}>
                    <SelectTrigger id="permission-scope">
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

            <TextAreaField id="permission-description" label="Deskripsi" placeholder="Jelaskan kapan permission ini dipakai" error={readErrorMessage(form.formState.errors, 'description')} disabled={isLoading} {...form.register('description')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isLoading} onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <LoadingButton type="submit" isLoading={isLoading}>
              {permission ? 'Simpan Perubahan' : 'Simpan Permission'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
