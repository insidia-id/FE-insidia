import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '../../shared/components/data-table/DataTable';
import { RombelSubjectColumns } from '../columns/RombelSubjectColumns';
import type { useRombelSubject } from '../hooks/useRombelSubject';

type RombelSubjectTableCardProps = {
  controller: ReturnType<typeof useRombelSubject>;
};

export function RombelSubjectTableCard({ controller }: RombelSubjectTableCardProps) {
  const columns = RombelSubjectColumns({
    setEditingItem: controller.state.setEditingItem,
    setIsFormOpen: controller.state.setIsFormOpen,
    setDeletingItem: controller.state.setDeletingItem,
  });

  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Kelas Mata Pelajaran</CardTitle>
          <CardDescription>Hubungkan kelas dengan mata pelajaran, guru, dan periode akademik.</CardDescription>
        </div>
        <Button variant="insidia" onClick={controller.actions.handleCreate}>
          <Plus className="mr-2 size-4" />
          Tambah Relasi
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={controller.queries.rombelSubjects}
          searchPlaceholder="Cari kelas mata pelajaran..."
          emptyMessage="Belum ada data kelas mata pelajaran."
          isLoading={controller.queries.isLoading}
          isError={controller.queries.isError}
          errorMessage="Gagal memuat data kelas mata pelajaran"
        />
      </CardContent>
    </Card>
  );
}
