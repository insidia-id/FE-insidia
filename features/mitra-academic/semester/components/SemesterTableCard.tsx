import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { useSemester } from '../hooks/useSemester';
import { SemesterColumns } from '../Columns/SemesterColumns';
type SemesterTableCardProps = {
  controller: ReturnType<typeof useSemester>;
};
export function SemesterTableCard({ controller }: SemesterTableCardProps) {
  const Columns = SemesterColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Semester</CardTitle>
          <CardDescription>Kelola periode akademik utama yang akan dipakai sebagai dasar semester dan kelas angkatan.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Semester
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={Columns}
          data={controller.queries.semesters}
          searchPlaceholder="Cari semester..."
          emptyMessage="Belum ada data semester."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage={`gagal Memuat Data Semester`}
        />
      </CardContent>
    </Card>
  );
}
