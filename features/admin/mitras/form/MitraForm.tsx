import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import type { FieldValues, Path, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { readErrorMessage } from '@/lib/form/form.helper';
import type { MitraType, StatusMitra } from '../types/mitras.types';
import { MITRA_STATUS_OPTIONS, MITRA_TYPES } from '../lib/mitra.helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BaseMitraFormShape = {
  name?: string;
  type?: MitraType;
  status?: StatusMitra;
};

type MitraFormFieldsProps<TFieldValues extends FieldValues & BaseMitraFormShape> = {
  form: UseFormReturn<TFieldValues, unknown, TFieldValues>;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: SubmitHandler<TFieldValues>;
  submitLabel: string;
  children?: ReactNode;
};

export function MitraFormFields<TFieldValues extends FieldValues & BaseMitraFormShape>({ form, isLoading, onCancel, onSubmit, submitLabel, children }: MitraFormFieldsProps<TFieldValues>) {
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField id="mitra-name" label="Nama Mitra" placeholder="SDN Sejahtera" error={readErrorMessage(form.formState.errors, 'name')} disabled={isLoading} {...form.register('name' as Path<TFieldValues>)} />
        <Controller
          control={form.control}
          name={'type' as Path<TFieldValues>}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe Mitra</label>

              <Select disabled={isLoading} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" disabled={isLoading}>
                  <SelectValue placeholder="Pilih tipe mitra" />
                </SelectTrigger>

                <SelectContent>
                  {MITRA_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {readErrorMessage(form.formState.errors, 'type') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'type')}</p>}
            </div>
          )}
        />
        <Controller
          control={form.control}
          name={'status' as Path<TFieldValues>}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>

              <Select disabled={isLoading} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" disabled={isLoading}>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>

                <SelectContent>
                  {MITRA_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {readErrorMessage(form.formState.errors, 'status') && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, 'status')}</p>}
            </div>
          )}
        />
      </div>

      {children}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button disabled={isLoading} onClick={onCancel} type="button" variant="outline">
          Batal
        </Button>
        <LoadingButton isLoading={isLoading} variant="insidia" type="submit">
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
