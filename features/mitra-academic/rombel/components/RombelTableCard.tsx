import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { RombelColumns } from '../columns/RombelColumns';
import type { useRombel } from '../hooks/useRombel';

type RombelTableCardProps = {
  controller: ReturnType<typeof useRombel>;
};

export function RombelTableCard({ controller }: RombelTableCardProps) {
  const columns = RombelColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });

  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Kelas</CardTitle>
          <CardDescription>Kelola rombongan belajar dan wali kelas untuk setiap angkatan.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Kelas
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={controller.queries.rombels}
          searchPlaceholder="Cari kelas..."
          emptyMessage="Belum ada data kelas."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage="Gagal memuat data kelas"
        />
      </CardContent>
    </Card>
  );
}
