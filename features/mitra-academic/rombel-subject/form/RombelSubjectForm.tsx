'use client';

import { readErrorMessage } from '@/lib/form/form.helper';
import { AcademicFormActions, AcademicSelectField, AcademicStatusSelectField } from '../../shared/components/crud/AcademicFormFields';
import type { useRombelSubject } from '../hooks/useRombelSubject';

type RombelSubjectFormProps = {
  form: ReturnType<typeof useRombelSubject>['form'];
  queries: ReturnType<typeof useRombelSubject>['queries'];
  isSubmitting: boolean;
  handleSubmit: () => void;
  editingItem?: ReturnType<typeof useRombelSubject>['state']['editingItem'];
  handleCloseForm: () => void;
};

export function RombelSubjectForm({ form, queries, isSubmitting, handleSubmit, editingItem, handleCloseForm }: RombelSubjectFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AcademicSelectField label="Kelas" value={form.watch('classGroupId')} onChange={(value) => form.setValue('classGroupId', value, { shouldValidate: true })} options={queries.rombelOptions} isLoading={queries.isLoadingRombels} isError={queries.isErrorRombels} error={readErrorMessage(form.formState.errors, 'classGroupId')} />
      <AcademicSelectField label="Mata Pelajaran" value={form.watch('courseId')} onChange={(value) => form.setValue('courseId', value, { shouldValidate: true })} options={queries.subjectOptions} isLoading={queries.isLoadingSubjects} isError={queries.isErrorSubjects} error={readErrorMessage(form.formState.errors, 'courseId')} />
      <AcademicSelectField label="Guru" value={form.watch('teacherId')} onChange={(value) => form.setValue('teacherId', value, { shouldValidate: true })} options={queries.teacherOptions} isLoading={queries.isLoadingTeachers} isError={queries.isErrorTeachers} error={readErrorMessage(form.formState.errors, 'teacherId')} />
      <AcademicSelectField label="Tahun Ajaran" value={form.watch('academicYearId')} onChange={(value) => form.setValue('academicYearId', value, { shouldValidate: true })} options={queries.academicYearOptions} isLoading={queries.isLoadingAcademicYears} isError={queries.isErrorAcademicYears} error={readErrorMessage(form.formState.errors, 'academicYearId')} />
      <AcademicSelectField label="Semester" value={form.watch('semesterId')} onChange={(value) => form.setValue('semesterId', value, { shouldValidate: true })} options={queries.semesterOptions} isLoading={queries.isLoadingSemesters} isError={queries.isErrorSemesters} error={readErrorMessage(form.formState.errors, 'semesterId')} />
      <AcademicStatusSelectField value={form.watch('status')} onChange={(value) => form.setValue('status', value, { shouldValidate: true })} error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />
      <AcademicFormActions isSubmitting={isSubmitting} isEditing={Boolean(editingItem)} onCancel={handleCloseForm} />
    </form>
  );
}
