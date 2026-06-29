'use client';

import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { AcademicFormActions, AcademicSelectField, AcademicStatusSelectField } from '../../shared/components/crud/AcademicFormFields';
import type { useClassBatch } from '../hooks/useClassBatch';

type ClassBatchFormProps = {
  form: ReturnType<typeof useClassBatch>['form'];
  queries: ReturnType<typeof useClassBatch>['queries'];
  isSubmitting: boolean;
  handleSubmit: () => void;
  editingItem?: ReturnType<typeof useClassBatch>['state']['editingItem'];
  handleCloseForm: () => void;
};

export function ClassBatchForm({ form, queries, isSubmitting, handleSubmit, editingItem, handleCloseForm }: ClassBatchFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AcademicSelectField
        label="Tahun Ajaran"
        value={form.watch('academicYearId')}
        onChange={(value) => form.setValue('academicYearId', value, { shouldValidate: true })}
        options={queries.academicYearOptions}
        isLoading={queries.isLoadingAcademicYears}
        isError={queries.isErrorAcademicYears}
        error={readErrorMessage(form.formState.errors, 'academicYearId')}
      />
      <AcademicSelectField
        label="Semester"
        value={form.watch('semesterId')}
        onChange={(value) => form.setValue('semesterId', value, { shouldValidate: true })}
        options={queries.semesterOptions}
        isLoading={queries.isLoadingSemesters}
        isError={queries.isErrorSemesters}
        error={readErrorMessage(form.formState.errors, 'semesterId')}
      />
      <AcademicSelectField
        label="Kurikulum"
        value={form.watch('curriculumId')}
        onChange={(value) => form.setValue('curriculumId', value, { shouldValidate: true })}
        options={queries.curriculumOptions}
        isLoading={queries.isLoadingCurricula}
        isError={queries.isErrorCurricula}
        error={readErrorMessage(form.formState.errors, 'curriculumId')}
      />
      <TextField id="class-batch-name" label="Angkatan" placeholder="Angkatan 2026" error={readErrorMessage(form.formState.errors, 'name')} disabled={isSubmitting} {...form.register('name')} />
      <TextField id="class-batch-level" label="Level" placeholder="Kelas 10" error={readErrorMessage(form.formState.errors, 'level')} disabled={isSubmitting} {...form.register('level')} />
      <AcademicStatusSelectField value={form.watch('status')} onChange={(value) => form.setValue('status', value, { shouldValidate: true })} error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />
      <AcademicFormActions isSubmitting={isSubmitting} isEditing={Boolean(editingItem)} onCancel={handleCloseForm} />
    </form>
  );
}
