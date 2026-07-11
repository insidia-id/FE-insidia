import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { ClassBatchColumns } from '../columns/ClassBatchColumns';
import type { useClassBatch } from '../hooks/useClassBatch';

type ClassBatchTableCardProps = {
  controller: ReturnType<typeof useClassBatch>;
};

export function ClassBatchTableCard({ controller }: ClassBatchTableCardProps) {
  const columns = ClassBatchColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });

  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Kelas Angkatan</CardTitle>
          <CardDescription>Kelola kelas angkatan sebagai pengelompokan utama siswa pada periode akademik.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Kelas
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={controller.queries.classBatches}
          searchPlaceholder="Cari kelas angkatan..."
          emptyMessage="Belum ada data kelas angkatan."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage="Gagal memuat data kelas angkatan"
        />
      </CardContent>
    </Card>
  );
}
