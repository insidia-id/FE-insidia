import { ReactNode } from 'react';
import { Controller, FieldValues, Path, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextAreaField, TextField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { readErrorMessage } from '@/lib/form/form.helper';
import { SocialLinks, StatusUser } from '../types/user.types';
import { RoleUser } from '../types/user.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAssignableRoleOptions, USER_STATUS_OPTIONS, getScopeByRole } from '../components/HelperUser';

type BaseUserFormShape = {
  email?: string;
  name?: string | null;
  phone?: string | null;
  role?: RoleUser;
  status?: StatusUser;
  socialLinks?: SocialLinks;
};

type UserFormFieldsProps<TFieldValues extends FieldValues & BaseUserFormShape> = {
  form: UseFormReturn<TFieldValues, unknown, TFieldValues>;
  currentUserRole?: string | null;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: SubmitHandler<TFieldValues>;
  submitLabel: string;
  mode: 'create' | 'update';
  children?: ReactNode;
};
export function UserFormFields<TFieldValues extends FieldValues & BaseUserFormShape>({ form, currentUserRole, isLoading, onCancel, onSubmit, submitLabel, mode, children }: UserFormFieldsProps<TFieldValues>) {
  const isUpdateMode = mode === 'update';
  const assignableRoleOptions = getAssignableRoleOptions(currentUserRole);

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField id="user-email" label="Email" type="email" placeholder="insidia@insidia.id" error={readErrorMessage(form.formState.errors, 'email')} disabled={isLoading} {...form.register('email' as Path<TFieldValues>)} />

        <TextField id="user-name" label="Nama" placeholder="Kafka" error={readErrorMessage(form.formState.errors, 'name')} disabled={isLoading} {...form.register('name' as Path<TFieldValues>)} />

        <TextField id="user-phone" label="Telepon" placeholder="081234567890" error={readErrorMessage(form.formState.errors, 'phone')} disabled={isLoading} {...form.register('phone' as Path<TFieldValues>)} />

        <div className="space-y-2">
          <Label>Role User</Label>
          <Controller
            control={form.control}
            name={'role' as Path<TFieldValues>}
            render={({ field }) => {
              const value = field.value as RoleUser | undefined;
              const selectedValue = assignableRoleOptions.some((option) => option.value === value) ? value : undefined;

              return (
                <Select
                  disabled={isLoading || assignableRoleOptions.length === 0}
                  onValueChange={(nextValue) => {
                    if (!nextValue) return;
                    field.onChange(nextValue);
                    form.setValue('scope' as Path<TFieldValues>, getScopeByRole(nextValue) as TFieldValues[Path<TFieldValues>], { shouldDirty: true, shouldTouch: true });
                  }}
                  value={selectedValue}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih role user" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableRoleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {readErrorMessage(form.formState.errors, 'role') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'role')}</p>}
        </div>
        <TextField id="user-scope" label="Scope" placeholder="Scope" error={readErrorMessage(form.formState.errors, 'scope')} readOnly className="bg-muted" {...form.register('scope' as Path<TFieldValues>)} />

        <div className="space-y-2">
          <Label>Status User</Label>
          <Controller
            control={form.control}
            name={'status' as Path<TFieldValues>}
            render={({ field }) => {
              const value = field.value as StatusUser | undefined;
              return (
                <Select
                  disabled={isLoading}
                  onValueChange={(nextValue) => {
                    if (!nextValue) return;
                    field.onChange(nextValue);
                  }}
                  value={value || undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {readErrorMessage(form.formState.errors, 'status') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'status')}</p>}
        </div>
      </div>
      {isUpdateMode && (
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="user-website-url"
            label="Website URL"
            placeholder="Contoh: https://example.com"
            error={readErrorMessage(form.formState.errors, 'websiteUrl')}
            disabled={isLoading}
            {...form.register('websiteUrl' as Path<TFieldValues>)}
          />

          <div className="md:col-span-2">
            <TextAreaField id="user-bio" label="Bio" placeholder="Tuliskan bio singkat user" error={readErrorMessage(form.formState.errors, 'bio')} disabled={isLoading} {...form.register('bio' as Path<TFieldValues>)} />
          </div>

          <TextField
            id="user-social-instagram"
            label="Instagram"
            placeholder="Contoh: https://instagram.com/username"
            error={readErrorMessage(form.formState.errors, 'socialLinks.instagram')}
            disabled={isLoading}
            {...form.register('socialLinks.instagram' as Path<TFieldValues>)}
          />

          <TextField
            id="user-social-linkedin"
            label="LinkedIn"
            placeholder="Contoh: https://linkedin.com/in/username"
            error={readErrorMessage(form.formState.errors, 'socialLinks.linkedin')}
            disabled={isLoading}
            {...form.register('socialLinks.linkedin' as Path<TFieldValues>)}
          />

          <TextField
            id="user-social-github"
            label="GitHub"
            placeholder="Contoh: https://github.com/username"
            error={readErrorMessage(form.formState.errors, 'socialLinks.github')}
            disabled={isLoading}
            {...form.register('socialLinks.github' as Path<TFieldValues>)}
          />
        </div>
      )}
      {children}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button disabled={isLoading} onClick={onCancel} type="button" variant="outline">
          Batal
        </Button>
        <LoadingButton isLoading={isLoading} type="submit">
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
