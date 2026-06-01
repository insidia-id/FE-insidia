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
import type { AccessScope } from '../../types/access-control.types';
import { ACCESS_SCOPE_OPTIONS } from '../../lib/access-control.helper';
import { Permission, PermissionFormValues } from '../types/permission.types';
import type { ModulePermission } from '../../module-permission/types/module-permission.types';
import { createPermissionSchema } from '../schema/permission.schema';
import { buildPermissionDefaultValues } from '../helper/permission.helper';

type PermissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: AccessScope;
  permission?: Permission | null;
  modulePermissions: ModulePermission[];
  isModulePermissionsLoading: boolean;
  isLoading: boolean;
  onSubmit: (values: PermissionFormValues) => void;
};

export function PermissionDialog({ open, onOpenChange, scope, permission, modulePermissions, isModulePermissionsLoading, isLoading, onSubmit }: PermissionDialogProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(createPermissionSchema({ requireModule: !permission })) as Resolver<PermissionFormValues>,
    defaultValues: buildPermissionDefaultValues(scope, permission),
  });
  console.log('PermissionDialog render with permission:', permission, 'and modulePermissions:', modulePermissions);
  useEffect(() => {
    form.reset(buildPermissionDefaultValues(scope, permission));
  }, [form, permission, scope, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{permission ? 'Edit Permission' : 'Tambah Permission'}</DialogTitle>
          <DialogDescription>Kode permission wajib mengikuti format `resource.action.scope`, misalnya `user.update.insidia`.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <TextField id="permission-name" label="Nama Permission" placeholder="User Create Insidia All" error={readErrorMessage(form.formState.errors, 'name')} disabled={isLoading} {...form.register('name')} />
            <TextField id="permission-code" label="Kode Permission" placeholder="user.update.insidia" error={readErrorMessage(form.formState.errors, 'code')} disabled={isLoading} {...form.register('code')} />

            {!permission && (
              <div className="space-y-2">
                <Label htmlFor="permission-module">Module Permission</Label>
                <Controller
                  control={form.control}
                  name="moduleId"
                  render={({ field }) => (
                    <Select disabled={isLoading || isModulePermissionsLoading} onValueChange={field.onChange} value={field.value ?? ''}>
                      <SelectTrigger id="permission-module">
                        <SelectValue placeholder={isModulePermissionsLoading ? 'Memuat module...' : 'Pilih module permission'} />
                      </SelectTrigger>
                      <SelectContent>
                        {modulePermissions.map((modulePermission) => (
                          <SelectItem key={modulePermission.id} value={modulePermission.id}>
                            {modulePermission.module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {readErrorMessage(form.formState.errors, 'moduleId') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'moduleId')}</p>}
              </div>
            )}

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

            <TextAreaField
              id="permission-description"
              label="Deskripsi"
              placeholder="Jelaskan kapan permission ini dipakai"
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
              {permission ? 'Simpan Perubahan' : 'Simpan Permission'}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
