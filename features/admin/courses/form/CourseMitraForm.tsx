import { Controller, UseFormReturn, useWatch } from 'react-hook-form';
import { readErrorMessage } from '@/lib/form/form.helper';
import { SelectField } from '@/components/common/form';
import { CourseFormValues } from '../schema/course.schema';
import { Combobox } from '@/components/common/Combobox';
import { Label } from '@/components/ui/label';
import { UserRoleCode } from '../../user/types/user.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';
type Props = {
  form: UseFormReturn<CourseFormValues>;
  isLoadingCourses?: boolean;
  curriculumOptions: Array<{ label: string; value: string }>;
  mitraOptions?: Array<{ label: string; value: string }>;
  isLoadingMitras?: boolean;
  userRole: UserRoleCode | null;
  setMitraQuery?: (query: string) => void;
};

export function CourseMitraForm({ form, isLoadingCourses, curriculumOptions, mitraOptions, isLoadingMitras, userRole, setMitraQuery }: Props) {
  const curriculumId = useWatch({
    control: form.control,
    name: 'curriculumId',
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 border-t pt-4">
      {userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' ? (
        <div className="space-y-2">
          <Label>Mitra</Label>

          <Controller
            control={form.control}
            name={`mitraId`}
            render={({ field }) => {
              return (
                <Combobox
                  data={mitraOptions as Array<{ label: string; value: string }>}
                  value={field.value || undefined}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Cari dan pilih mitra"
                  disabled={isLoadingMitras}
                  onSearch={setMitraQuery}
                />
              );
            }}
          />

          {readErrorMessage(form.formState.errors, `mitraId`) && <p className="text-sm text-destructive">{readErrorMessage(form.formState.errors, `mitraId`)}</p>}
        </div>
      ) : null}

      <Controller
        control={form.control}
        name="curriculumId"
        render={({ field }) => {
          return (
            <SelectField
              label="Kurikulum"
              value={field.value}
              onChange={field.onChange}
              options={curriculumOptions}
              placeholder="Pilih kurikulum"
              error={readErrorMessage(form.formState.errors, 'curriculumId')}
              disabled={isLoadingCourses}
            />
          );
        }}
      />
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
            disabled={isLoadingCourses}
          />
        )}
      />
    </div>
  );
}
