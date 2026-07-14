'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSemester } from '../hooks/useSemester';
import { useAcademicYearController } from '../../academic-year/hooks/AcademicYearController';
import { readErrorMessage } from '@/lib/form/form.helper';
import { TextField } from '@/components/common/form';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { Button } from '@/components/ui/button';

type SemesterFormProps = {
  form: ReturnType<typeof useSemester>['form'];
  isSubmitting: boolean;
  handleSubmit: (values: any) => void;
  editingItem?: ReturnType<typeof useSemester>['state']['editingItem'];
  handleCloseForm: () => void;
  mitraId: string | null;
};

export function SemesterForm({ form, isSubmitting, handleSubmit, editingItem, handleCloseForm, mitraId }: SemesterFormProps) {
  const {
    queries: { academicYears, isLoading: isLoadingAcademicYears, isError: isErrorAcademicYears },
  } = useAcademicYearController(mitraId ?? '');

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tahun Ajaran</label>

        <Select
          value={form.watch('academicYearId')}
          onValueChange={(value) =>
            form.setValue('academicYearId', value, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Tahun Ajaran" />
          </SelectTrigger>

          <SelectContent>
            {isLoadingAcademicYears ? (
              <SelectItem value="loading" disabled>
                memuat data...
              </SelectItem>
            ) : isErrorAcademicYears ? (
              <SelectItem value="error" disabled>
                Terjadi kesalahan saat memuat data
              </SelectItem>
            ) : (
              academicYears?.map((academicYear) => (
                <SelectItem key={academicYear.id} value={academicYear.id}>
                  {academicYear.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {form.formState.errors.academicYearId && <p className="text-sm text-destructive">{form.formState.errors.academicYearId.message}</p>}
      </div>

      <div className="space-y-2">
        <TextField id="Nama Semester" label="Nama Semester" placeholder="2026/2027" error={readErrorMessage(form.formState.errors, 'name')} disabled={isSubmitting} {...form.register('name')} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tanggal Mulai</label>

        <Input type="date" {...form.register('startDate')} />

        {form.formState.errors.startDate && <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tanggal Selesai</label>

        <Input type="date" {...form.register('endDate')} />

        {form.formState.errors.endDate && <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>

        <Select
          value={form.watch('status')}
          onValueChange={(value) =>
            form.setValue('status', value as 'ACTIVE' | 'INACTIVE', {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>

            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {form.formState.errors.status && <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>}
      </div>
      <div className="space-y-2">
        <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>
          Batal
        </Button>
        <LoadingButton type="submit" variant="insidia" isLoading={isSubmitting}>
          {editingItem ? 'Perbarui' : 'Simpan'}
        </LoadingButton>
      </div>
    </form>
  );
}
