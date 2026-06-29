'use client';

import { TextField } from '@/components/common/form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { AcademicFormActions, AcademicSelectField, AcademicStatusSelectField } from '../../shared/components/crud/AcademicFormFields';
import type { useRombel } from '../hooks/useRombel';

type RombelFormProps = {
  form: ReturnType<typeof useRombel>['form'];
  queries: ReturnType<typeof useRombel>['queries'];
  isSubmitting: boolean;
  handleSubmit: () => void;
  editingItem?: ReturnType<typeof useRombel>['state']['editingItem'];
  handleCloseForm: () => void;
};

export function RombelForm({ form, queries, isSubmitting, handleSubmit, editingItem, handleCloseForm }: RombelFormProps) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AcademicSelectField
        label="Angkatan"
        value={form.watch('classId')}
        onChange={(value) => form.setValue('classId', value, { shouldValidate: true })}
        options={queries.classBatchOptions}
        isLoading={queries.isLoadingClassBatches}
        isError={queries.isErrorClassBatches}
        error={readErrorMessage(form.formState.errors, 'classId')}
      />
      <TextField id="rombel-name" label="Nama Kelas" placeholder="X IPA 1" error={readErrorMessage(form.formState.errors, 'name')} disabled={isSubmitting} {...form.register('name')} />
      <AcademicSelectField
        label="Wali Kelas"
        value={form.watch('waliKelasId')}
        onChange={(value) => form.setValue('waliKelasId', value, { shouldValidate: true })}
        options={queries.teacherOptions}
        isLoading={queries.isLoadingTeachers}
        isError={queries.isErrorTeachers}
        error={readErrorMessage(form.formState.errors, 'waliKelasId')}
      />
      <AcademicStatusSelectField value={form.watch('status')} onChange={(value) => form.setValue('status', value, { shouldValidate: true })} error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />
      <AcademicFormActions isSubmitting={isSubmitting} isEditing={Boolean(editingItem)} onCancel={handleCloseForm} />
    </form>
  );
}
