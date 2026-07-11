'use client';

import { Controller } from 'react-hook-form';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextAreaField, TextField, SelectField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { readErrorMessage } from '@/lib/form/form.helper';
import { COURSE_SCOPE_OPTIONS } from '../lib/course.helper';
import type { CourseFormValues } from '../schema/course.schema';
import { CourseScopeRow } from './CourseScopeRow';
import type { UserRoleCode } from '@/features/admin/user/types/user.types';
type CourseFormProps = {
  form: UseFormReturn<CourseFormValues, unknown, CourseFormValues>;
  isSubmitting: boolean;
  onSubmit: SubmitHandler<CourseFormValues>;
  onCancel: () => void;
  submitLabel: string;
  curriculumOptions?: Array<{ label: string; value: string }>;
  disableScopeField?: boolean;
  mitraOptions?: Array<{ label: string; value: string }>;
  isLoadingMitras?: boolean;
  userRole: UserRoleCode | null;
  setMitraQuery?: (query: string) => void;
  getCurrentScope?: readonly {
    label: string;
    value: string;
  }[];
};

export function CourseForm({ form, isSubmitting, onSubmit, onCancel, submitLabel, curriculumOptions = [], disableScopeField = false, mitraOptions, isLoadingMitras, userRole, setMitraQuery, getCurrentScope }: CourseFormProps) {
  const scope = form.watch('scope');
  const isMitraCourse = scope === 'MITRA';

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          id="course-title"
          label={isMitraCourse ? 'Nama Mapel' : 'Judul Course'}
          placeholder={isMitraCourse ? 'Matematika Wajib' : 'Belajar TypeScript Dasar'}
          error={readErrorMessage(form.formState.errors, 'title')}
          disabled={isSubmitting}
          {...form.register('title')}
        />
        <TextField id="course-code" label="Kode Mapel" placeholder="MTK-WAJIB" error={readErrorMessage(form.formState.errors, 'code')} disabled={isSubmitting} value={form.watch('code') ?? ''} {...form.register('code')} />

        <TextField
          id="course-slug"
          label={isMitraCourse ? 'Slug Otomatis' : 'Slug'}
          placeholder={isMitraCourse ? 'Slug digenerate dari mitra, kode, dan nama mapel' : 'belajar-typescript-dasar'}
          error={readErrorMessage(form.formState.errors, 'slug')}
          disabled={isSubmitting || isMitraCourse}
          {...form.register('slug')}
        />
        <TextField
          id="course-subtitle"
          label={isMitraCourse ? 'Subjudul Opsional' : 'Subtitle'}
          placeholder={isMitraCourse ? 'Mapel inti semester ganjil' : 'Ringkasan singkat course'}
          error={readErrorMessage(form.formState.errors, 'subtitle')}
          disabled={isSubmitting}
          value={form.watch('subtitle') ?? ''}
          {...form.register('subtitle')}
        />
        <Controller
          control={form.control}
          name="scope"
          render={({ field }) => (
            <SelectField
              label="Scope"
              value={field.value}
              onChange={field.onChange}
              options={getCurrentScope ? getCurrentScope : COURSE_SCOPE_OPTIONS}
              placeholder="Pilih scope"
              error={readErrorMessage(form.formState.errors, 'scope')}
              disabled={isSubmitting || disableScopeField}
            />
          )}
        />
        <TextAreaField
          id="course-description"
          label={isMitraCourse ? 'Deskripsi Mapel' : 'Deskripsi'}
          placeholder={isMitraCourse ? 'Tulis deskripsi mapel di sini' : 'Tulis deskripsi course di sini'}
          error={readErrorMessage(form.formState.errors, 'description')}
          disabled={isSubmitting}
          value={form.watch('description') ?? ''}
          {...form.register('description')}
        />
      </div>

      <CourseScopeRow scope={scope} form={form} isLoadingCourses={isSubmitting} curriculumOptions={curriculumOptions} mitraOptions={mitraOptions} isLoadingMitras={isLoadingMitras} userRole={userRole} setMitraQuery={setMitraQuery} />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
          Batal
        </Button>
        <LoadingButton type="submit" variant="insidia" isLoading={isSubmitting}>
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
}
