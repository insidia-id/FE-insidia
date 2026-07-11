import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { useAcademicYearController } from '../hooks/AcademicYearController';
import { columns } from '../columns/AcademicYearColumns';
type AcademicYearTableCardProps = {
  controller: ReturnType<typeof useAcademicYearController>;
};
export function AcademicYearTableCard({ controller }: AcademicYearTableCardProps) {
  const Columns = columns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Tahun Ajaran</CardTitle>
          <CardDescription>Kelola periode akademik utama yang akan dipakai sebagai dasar semester dan kelas angkatan.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Tahun Ajaran
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={Columns}
          data={controller.queries.academicYears}
          searchPlaceholder="Cari tahun ajaran..."
          emptyMessage="Belum ada data tahun ajaran."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage={`gagal Memuat Data Tahun Ajaran`}
        />
      </CardContent>
    </Card>
  );
}
