import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import type { Subject } from '../types/subject.types';

type SubjectColumnsProps = {
  setEditingItem: (item: Subject | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: Subject | null) => void;
};

export function SubjectColumns({ setEditingItem, setIsFormOpen, setDeletingItem }: SubjectColumnsProps): ColumnDef<Subject>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Mata Pelajaran',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'code',
      header: 'Kode',
      cell: ({ row }) => row.original.code ?? '-',
    },
    {
      accessorKey: 'curriculum.name',
      header: 'Kurikulum',
      cell: ({ row }) => row.original.curriculum?.name ?? '-',
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
