import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { SubjectColumns } from '../columns/SubjectColumns';
import type { useSubject } from '../hooks/useSubject';

type SubjectTableCardProps = {
  controller: ReturnType<typeof useSubject>;
};

export function SubjectTableCard({ controller }: SubjectTableCardProps) {
  const columns = SubjectColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });

  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Mata Pelajaran</CardTitle>
          <CardDescription>Kelola Mata Pelajaran yang terhubung ke kurikulum mitra.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Mata Pelajaran
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={controller.queries.subjects}
          searchPlaceholder="Cari mata pelajaran..."
          emptyMessage="Belum ada data mata pelajaran."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage="Gagal memuat data mata pelajaran"
        />
      </CardContent>
    </Card>
  );
}
