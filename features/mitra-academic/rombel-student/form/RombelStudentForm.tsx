'use client';

import { readErrorMessage } from '@/lib/form/form.helper';
import { AcademicFormActions, AcademicSelectField, AcademicStatusSelectField } from '../../shared/components/crud/AcademicFormFields';
import type { useRombelStudent } from '../hooks/useRombelStudent';

type RombelStudentFormProps = {
  form: ReturnType<typeof useRombelStudent>['form'];
  queries: ReturnType<typeof useRombelStudent>['queries'];
  isSubmitting: boolean;
  handleSubmit: () => void;
  editingItem?: ReturnType<typeof useRombelStudent>['state']['editingItem'];
  handleCloseForm: () => void;
};

export function RombelStudentForm({ form, queries, isSubmitting, handleSubmit, editingItem, handleCloseForm }: RombelStudentFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AcademicSelectField label="Kelas" value={form.watch('classGroupId')} onChange={(value) => form.setValue('classGroupId', value, { shouldValidate: true })} options={queries.rombelOptions} isLoading={queries.isLoadingRombels} isError={queries.isErrorRombels} error={readErrorMessage(form.formState.errors, 'classGroupId')} />
      <AcademicSelectField label="Siswa" value={form.watch('studentId')} onChange={(value) => form.setValue('studentId', value, { shouldValidate: true })} options={queries.studentOptions} isLoading={queries.isLoadingStudents} isError={queries.isErrorStudents} error={readErrorMessage(form.formState.errors, 'studentId')} />
      <AcademicSelectField label="Tahun Ajaran" value={form.watch('academicYearId')} onChange={(value) => form.setValue('academicYearId', value, { shouldValidate: true })} options={queries.academicYearOptions} isLoading={queries.isLoadingAcademicYears} isError={queries.isErrorAcademicYears} error={readErrorMessage(form.formState.errors, 'academicYearId')} />
      <AcademicSelectField label="Semester" value={form.watch('semesterId')} onChange={(value) => form.setValue('semesterId', value, { shouldValidate: true })} options={queries.semesterOptions} isLoading={queries.isLoadingSemesters} isError={queries.isErrorSemesters} error={readErrorMessage(form.formState.errors, 'semesterId')} />
      <AcademicStatusSelectField value={form.watch('status')} onChange={(value) => form.setValue('status', value, { shouldValidate: true })} error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />
      <AcademicFormActions isSubmitting={isSubmitting} isEditing={Boolean(editingItem)} onCancel={handleCloseForm} />
    </form>
  );
}
