import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { TextField, SelectField, TextAreaField } from '@/components/common/form';
import { CourseFormValues } from '../schema/course.schema';
import { COURSE_LEVEL_OPTIONS, joinLines } from '../lib/course.helper';
type Props = {
  form: UseFormReturn<CourseFormValues>;
  isLoadingCourses?: boolean;
};

export function CourseInsidiaForm({ form, isLoadingCourses }: Props) {
  const isFree = useWatch({
    control: form.control,
    name: 'isFree',
  });
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
        <Controller
          control={form.control}
          name="level"
          render={({ field }) => (
            <SelectField label="Level" value={field.value} onChange={field.onChange} options={COURSE_LEVEL_OPTIONS} placeholder="Pilih level" error={readErrorMessage(form.formState.errors, 'level')} disabled={isLoadingCourses} />
          )}
        />
        <Controller
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <SelectField
              label="Gratis"
              value={String(field.value)}
              onChange={(value) => {
                field.onChange(value === 'true');
              }}
              options={[
                { label: 'Gratis', value: 'true' },
                { label: 'Berbayar', value: 'false' },
              ]}
              placeholder="Pilih tipe harga"
              error={readErrorMessage(form.formState.errors, 'isFree')}
              disabled={isLoadingCourses}
            />
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField id="course-price" label="Harga Normal" type="number" min={0} step="0.01" error={readErrorMessage(form.formState.errors, 'price')} disabled={isLoadingCourses || isFree} {...form.register('price')} />
        <TextField
          id="course-sale-price"
          label="Harga Promo"
          type="number"
          min={0}
          step="0.01"
          error={readErrorMessage(form.formState.errors, 'salePrice')}
          disabled={isLoadingCourses || isFree}
          value={form.watch('salePrice') ?? ''}
          {...form.register('salePrice')}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <TextAreaField
          id="course-requirements"
          label={'Requirements'}
          placeholder="Satu baris satu requirement"
          error={readErrorMessage(form.formState.errors, 'requirements')}
          disabled={isLoadingCourses}
          value={joinLines(form.watch('requirements') ?? [])}
          onChange={(event) =>
            form.setValue(
              'requirements',
              event.target.value
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
              { shouldValidate: true },
            )
          }
        />
        <TextAreaField
          id="course-outcomes"
          label={'Outcomes'}
          placeholder="Satu baris satu outcome"
          error={readErrorMessage(form.formState.errors, 'outcomes')}
          disabled={isLoadingCourses}
          value={joinLines(form.watch('outcomes') ?? [])}
          onChange={(event) =>
            form.setValue(
              'outcomes',
              event.target.value
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
              { shouldValidate: true },
            )
          }
        />
        <TextAreaField
          id="course-target-users"
          label={'Target Users'}
          placeholder="Satu baris satu target user"
          error={readErrorMessage(form.formState.errors, 'targetUsers')}
          disabled={isLoadingCourses}
          value={joinLines(form.watch('targetUsers') ?? [])}
          onChange={(event) =>
            form.setValue(
              'targetUsers',
              event.target.value
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
              { shouldValidate: true },
            )
          }
        />
      </div>
    </>
  );
}
