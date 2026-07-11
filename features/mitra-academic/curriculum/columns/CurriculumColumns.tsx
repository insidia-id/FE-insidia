import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import type { Curriculum } from '../types/curriculum.types';

type CurriculumColumnsProps = {
  setEditingItem: (item: Curriculum | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: Curriculum | null) => void;
};

export function CurriculumColumns({ setEditingItem, setIsFormOpen, setDeletingItem }: CurriculumColumnsProps): ColumnDef<Curriculum>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Nama Kurikulum',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'code',
      header: 'Kode',
      cell: ({ row }) => row.original.code ?? '-',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingItem(row.original);
              setIsFormOpen(true);
            }}
          >
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeletingItem(row.original)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];
}
