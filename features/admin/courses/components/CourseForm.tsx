'use client';

import { Controller } from 'react-hook-form';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { TextAreaField, TextField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { readErrorMessage } from '@/lib/form/form.helper';
import { COURSE_LEVEL_OPTIONS, COURSE_SCOPE_OPTIONS, COURSE_STATUS_OPTIONS, joinLines } from '../lib/course.helper';
import type { CourseFormValues } from '../schema/course.schema';

type CourseFormProps = {
  form: UseFormReturn<CourseFormValues, unknown, CourseFormValues>;
  isSubmitting: boolean;
  onSubmit: SubmitHandler<CourseFormValues>;
  onCancel: () => void;
  submitLabel: string;
  curriculumOptions?: Array<{ label: string; value: string }>;
  showScopeField?: boolean;
  disableScopeField?: boolean;
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function CourseForm({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel,
  curriculumOptions = [],
  showScopeField = true,
  disableScopeField = false,
}: CourseFormProps) {
  const isFree = form.watch('isFree');
  const status = form.watch('status');
  const scope = form.watch('scope');
  const isMitraCourse = scope === 'MITRA';
  const entityLabel = isMitraCourse ? 'Mapel' : 'Course';

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField id="course-title" label={isMitraCourse ? 'Nama Mapel' : 'Judul Course'} placeholder={isMitraCourse ? 'Matematika Wajib' : 'Belajar TypeScript Dasar'} error={readErrorMessage(form.formState.errors, 'title')} disabled={isSubmitting} {...form.register('title')} />
        {isMitraCourse ? (
          <TextField id="course-code" label="Kode Mapel" placeholder="MTK-WAJIB" error={readErrorMessage(form.formState.errors, 'code')} disabled={isSubmitting} value={form.watch('code') ?? ''} {...form.register('code')} />
        ) : (
          <TextField id="course-language" label="Bahasa" placeholder="id" error={readErrorMessage(form.formState.errors, 'language')} disabled={isSubmitting} {...form.register('language')} />
        )}
        <TextField id="course-slug" label={isMitraCourse ? 'Slug Otomatis' : 'Slug'} placeholder={isMitraCourse ? 'Slug digenerate dari mitra, kode, dan nama mapel' : 'belajar-typescript-dasar'} error={readErrorMessage(form.formState.errors, 'slug')} disabled={isSubmitting || isMitraCourse} {...form.register('slug')} />
        <TextField id="course-subtitle" label={isMitraCourse ? 'Subjudul Opsional' : 'Subtitle'} placeholder={isMitraCourse ? 'Mapel inti semester ganjil' : 'Ringkasan singkat course'} error={readErrorMessage(form.formState.errors, 'subtitle')} disabled={isSubmitting} value={form.watch('subtitle') ?? ''} {...form.register('subtitle')} />
        {isMitraCourse ? (
          <Controller
            control={form.control}
            name="curriculumId"
            render={({ field }) => <SelectField label="Kurikulum" value={field.value} onChange={field.onChange} options={curriculumOptions} placeholder="Pilih kurikulum" error={readErrorMessage(form.formState.errors, 'curriculumId')} disabled={isSubmitting} />}
          />
        ) : null}
      </div>

      <TextAreaField
        id="course-description"
        label={isMitraCourse ? 'Deskripsi Mapel' : 'Deskripsi'}
        placeholder={isMitraCourse ? 'Tulis deskripsi mapel di sini' : 'Tulis deskripsi course di sini'}
        error={readErrorMessage(form.formState.errors, 'description')}
        disabled={isSubmitting}
        value={form.watch('description') ?? ''}
        {...form.register('description')}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => <SelectField label="Status" value={field.value} onChange={field.onChange} options={COURSE_STATUS_OPTIONS} placeholder="Pilih status" error={readErrorMessage(form.formState.errors, 'status')} disabled={isSubmitting} />}
        />
        {isMitraCourse && (
          <Controller
            control={form.control}
            name="academicStatus"
            render={({ field }) => (
              <SelectField
                label="Status Akademik"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
                placeholder="Pilih status akademik"
                error={readErrorMessage(form.formState.errors, 'academicStatus')}
                disabled={isSubmitting}
              />
            )}
          />
        )}
        <Controller
          control={form.control}
          name="level"
          render={({ field }) => <SelectField label="Level" value={field.value} onChange={field.onChange} options={COURSE_LEVEL_OPTIONS} placeholder="Pilih level" error={readErrorMessage(form.formState.errors, 'level')} disabled={isSubmitting} />}
        />
        <Controller
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <SelectField
              label="Gratis"
              value={String(field.value)}
              onChange={(value) => field.onChange(value === 'true')}
              options={[
                { label: 'Gratis', value: 'true' },
                { label: 'Berbayar', value: 'false' },
              ]}
              placeholder="Pilih tipe harga"
              error={readErrorMessage(form.formState.errors, 'isFree')}
              disabled={isSubmitting}
            />
          )}
        />
        {showScopeField && (
          <Controller
            control={form.control}
            name="scope"
            render={({ field }) => <SelectField label="Scope" value={field.value} onChange={field.onChange} options={COURSE_SCOPE_OPTIONS} placeholder="Pilih scope" error={readErrorMessage(form.formState.errors, 'scope')} disabled={isSubmitting || disableScopeField} />}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField id="course-price" label="Harga Normal" type="number" min={0} step="0.01" error={readErrorMessage(form.formState.errors, 'price')} disabled={isSubmitting || isFree} {...form.register('price')} />
        <TextField id="course-sale-price" label="Harga Promo" type="number" min={0} step="0.01" error={readErrorMessage(form.formState.errors, 'salePrice')} disabled={isSubmitting || isFree} value={form.watch('salePrice') ?? ''} {...form.register('salePrice')} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextAreaField id="course-requirements" label={isMitraCourse ? `${entityLabel} Requirements` : 'Requirements'} placeholder="Satu baris satu requirement" error={readErrorMessage(form.formState.errors, 'requirements')} disabled={isSubmitting} value={joinLines(form.watch('requirements') ?? [])} onChange={(event) => form.setValue('requirements', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean), { shouldValidate: true })} />
        <TextAreaField id="course-outcomes" label={isMitraCourse ? `${entityLabel} Outcomes` : 'Outcomes'} placeholder="Satu baris satu outcome" error={readErrorMessage(form.formState.errors, 'outcomes')} disabled={isSubmitting} value={joinLines(form.watch('outcomes') ?? [])} onChange={(event) => form.setValue('outcomes', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean), { shouldValidate: true })} />
        <TextAreaField id="course-target-users" label={isMitraCourse ? 'Target Pengguna' : 'Target User'} placeholder="Satu baris satu target user" error={readErrorMessage(form.formState.errors, 'targetUsers')} disabled={isSubmitting} value={joinLines(form.watch('targetUsers') ?? [])} onChange={(event) => form.setValue('targetUsers', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean), { shouldValidate: true })} />
      </div>

      {status === 'REJECTED' && (
        <TextAreaField
          id="course-reject-reason"
          label="Alasan Penolakan"
          placeholder="Jelaskan alasan penolakan course"
          error={readErrorMessage(form.formState.errors, 'rejectReason')}
          disabled={isSubmitting}
          value={form.watch('rejectReason') ?? ''}
          {...form.register('rejectReason')}
        />
      )}

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
