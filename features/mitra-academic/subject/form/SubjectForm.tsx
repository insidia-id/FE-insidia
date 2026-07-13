'use client';

import { TextAreaField, TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { AcademicFormActions, AcademicSelectField, AcademicStatusSelectField } from '../../shared/components/crud/AcademicFormFields';
import type { useSubject } from '../hooks/useSubject';

type SubjectFormProps = {
  form: ReturnType<typeof useSubject>['form'];
  queries: ReturnType<typeof useSubject>['queries'];
  isSubmitting: boolean;
  handleSubmit: () => void;
  editingItem?: ReturnType<typeof useSubject>['state']['editingItem'];
  handleCloseForm: () => void;
};

export function SubjectForm({ form, queries, isSubmitting, handleSubmit, editingItem, handleCloseForm }: SubjectFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AcademicSelectField
        label="Kurikulum"
        value={form.watch('curriculumId')}
        onChange={(value) => form.setValue('curriculumId', value, { shouldValidate: true })}
        options={queries.curriculumOptions}
        isLoading={queries.isLoadingCurricula}
        isError={queries.isErrorCurricula}
        error={readErrorMessage(form.formState.errors, 'curriculumId')}
      />
      <TextField id="subject-name" label="Nama Mapel" placeholder="Matematika" error={readErrorMessage(form.formState.errors, 'name')} disabled={isSubmitting} {...form.register('name')} />
      <TextField id="subject-code" label="Kode Mapel" placeholder="MTK" error={readErrorMessage(form.formState.errors, 'code')} disabled={isSubmitting} {...form.register('code')} />
      <TextAreaField id="subject-description" label="Deskripsi" error={readErrorMessage(form.formState.errors, 'description')} disabled={isSubmitting} {...form.register('description')} />
      <AcademicStatusSelectField value={form.watch('status')} onChange={(value) => form.setValue('status', value, { shouldValidate: true })} error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />
      <AcademicFormActions isSubmitting={isSubmitting} isEditing={Boolean(editingItem)} onCancel={handleCloseForm} />
    </form>
  );
}
