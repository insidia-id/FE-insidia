'use client';

import { TextAreaField, TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { AcademicFormActions, AcademicStatusSelectField } from '../../shared/components/crud/AcademicFormFields';
import type { useCurriculum } from '../hooks/useCurriculum';

type CurriculumFormProps = {
  form: ReturnType<typeof useCurriculum>['form'];
  isSubmitting: boolean;
  handleSubmit: () => void;
  editingItem?: ReturnType<typeof useCurriculum>['state']['editingItem'];
  handleCloseForm: () => void;
};

export function CurriculumForm({ form, isSubmitting, handleSubmit, editingItem, handleCloseForm }: CurriculumFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TextField id="curriculum-name" label="Nama Kurikulum" placeholder="Kurikulum Merdeka" error={readErrorMessage(form.formState.errors, 'name')} disabled={isSubmitting} {...form.register('name')} />
      <TextField id="curriculum-code" label="Kode" placeholder="MERDEKA" error={readErrorMessage(form.formState.errors, 'code')} disabled={isSubmitting} {...form.register('code')} />
      <TextAreaField id="curriculum-description" label="Deskripsi" error={readErrorMessage(form.formState.errors, 'description')} disabled={isSubmitting} {...form.register('description')} />
      <AcademicStatusSelectField value={form.watch('status')} onChange={(value) => form.setValue('status', value, { shouldValidate: true })} error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />
      <AcademicFormActions isSubmitting={isSubmitting} isEditing={Boolean(editingItem)} onCancel={handleCloseForm} />
    </form>
  );
}
