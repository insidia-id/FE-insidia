import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import type { AcademicClass } from '../types/class-batch.types';

type ClassBatchColumnsProps = {
  setEditingItem: (item: AcademicClass | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: AcademicClass | null) => void;
};

export function ClassBatchColumns({ setEditingItem, setIsFormOpen, setDeletingItem }: ClassBatchColumnsProps): ColumnDef<AcademicClass>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Angkatan',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => row.original.level,
    },
    {
      accessorKey: 'semester.name',
      header: 'Semester',
      cell: ({ row }) => row.original.semester.name,
    },
    {
      accessorKey: 'curriculum.name',
      header: 'Kurikulum',
      cell: ({ row }) => row.original.curriculum.name,
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
