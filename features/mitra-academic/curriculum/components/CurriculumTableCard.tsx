import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { CurriculumColumns } from '../columns/CurriculumColumns';
import type { useCurriculum } from '../hooks/useCurriculum';

type CurriculumTableCardProps = {
  controller: ReturnType<typeof useCurriculum>;
};

export function CurriculumTableCard({ controller }: CurriculumTableCardProps) {
  const columns = CurriculumColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });

  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Kurikulum</CardTitle>
          <CardDescription>Kelola data kurikulum sebagai fondasi Mata Pelajaran dan kelas akademik.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Kurikulum
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={controller.queries.curriculum}
          searchPlaceholder="Cari kurikulum..."
          emptyMessage="Belum ada data kurikulum."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage="Gagal memuat data kurikulum"
        />
      </CardContent>
    </Card>
  );
}
