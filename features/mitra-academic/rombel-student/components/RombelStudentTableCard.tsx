import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { RombelStudentColumns } from '../columns/RombelStudentColumns';
import type { useRombelStudent } from '../hooks/useRombelStudent';

type RombelStudentTableCardProps = {
  controller: ReturnType<typeof useRombelStudent>;
};

export function RombelStudentTableCard({ controller }: RombelStudentTableCardProps) {
  const columns = RombelStudentColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });

  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Kelas Siswa</CardTitle>
          <CardDescription>Kelola relasi siswa dengan kelas pada tahun ajaran dan semester tertentu.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Siswa
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={controller.queries.rombelStudents}
          searchPlaceholder="Cari kelas siswa..."
          emptyMessage="Belum ada data kelas siswa."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage="Gagal memuat data kelas siswa"
        />
      </CardContent>
    </Card>
  );
}
