'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { CourseModuleFormValues } from '@/features/admin/courses-module/schema/courses-module.schema';
import { readErrorMessage } from '@/lib/form/form.helper';
import { SelectField, TextAreaField, TextField } from '@/components/common/form';

interface ModuleFormDialogProps {
  classGroupOptions: { label: string; value: string }[];
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CourseModuleFormValues>;
  onSubmit: (data: CourseModuleFormValues) => void;
  isSubmitting: boolean;
  isEditing: boolean;
  activeMitraId: string | null;
}

export function ModuleFormDialog({ activeMitraId, onOpenChange, form, onSubmit, isSubmitting, isEditing, classGroupOptions }: ModuleFormDialogProps) {
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <TextField label="mitraId" id="mitraId" className="bg-muted" value={activeMitraId || ''} {...form.register('mitraId')} disabled />
      </div>
      <div className="space-y-2">
        <TextField label="Judul Modul" id="title" placeholder="Masukkan judul modul" error={readErrorMessage(form.formState.errors, 'title')} {...form.register('title')} />
      </div>

      <div className="space-y-2">
        <TextAreaField label="Deskripsi Modul" id="description" placeholder="Masukkan deskripsi modul" error={readErrorMessage(form.formState.errors, 'description')} {...form.register('summary')} />
      </div>

      <Controller
        control={form.control}
        name="sortOrder"
        render={({ field }) => (
          <div className="space-y-2">
            <TextField label="Urutan" id="sortOrder" type="number" min={0} error={readErrorMessage(form.formState.errors, 'sortOrder')} {...field} />
          </div>
        )}
      />
      <Controller
        control={form.control}
        name="classGroupCourseId"
        render={({ field }) => (
          <SelectField
            label="Kelas Grup"
            placeholder="Pilih kelas grup"
            disabled={isSubmitting}
            onChange={field.onChange}
            error={readErrorMessage(form.formState.errors, 'classGroupCourseId')}
            options={classGroupOptions}
            value={field.value || ''}
          />
        )}
      />

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
          Batal
        </Button>
        <LoadingButton type="submit" variant="default" isLoading={isSubmitting} className="bg-[#8557E5] hover:bg-[#6f44c9]">
          {isEditing ? 'Perbarui Modul' : 'Simpan Modul'}
        </LoadingButton>
      </div>
    </form>
  );
}
