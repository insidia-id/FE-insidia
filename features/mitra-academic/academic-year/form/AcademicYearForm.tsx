import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/ButtonLoading';
import { useAcademicYearController } from '../hooks/AcademicYearController';
import { readErrorMessage } from '@/lib/form/form.helper';
import { TextField } from '@/components/common/form';
type AcademicYearFormProps = {
  form: ReturnType<typeof useAcademicYearController>['form'];
  isSubmitting: boolean;
  handleSubmit: (values: any) => void;
  editingItem?: ReturnType<typeof useAcademicYearController>['state']['editingItem'];
  handleCloseForm: () => void;
};
export const AcademicYearForm = ({ form, isSubmitting, handleSubmit, editingItem, handleCloseForm }: AcademicYearFormProps) => {
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <TextField id="Tahun Ajaran" label="Nama Tahun Ajaran" placeholder="2026/2027" error={readErrorMessage(form.formState.errors, 'name')} disabled={isSubmitting} {...form.register('name')} />
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
        <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as 'ACTIVE' | 'INACTIVE')}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih status" />
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
};
