import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import type { ClassGroup } from '../types/rombel.types';

type RombelColumnsProps = {
  setEditingItem: (item: ClassGroup | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: ClassGroup | null) => void;
};

export function RombelColumns({ setEditingItem, setIsFormOpen, setDeletingItem }: RombelColumnsProps): ColumnDef<ClassGroup>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Kelas',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'academicClass.name',
      header: 'Angkatan',
      cell: ({ row }) => row.original.academicClass.name,
    },
    {
      accessorKey: 'waliKelas.name',
      header: 'Wali Kelas',
      cell: ({ row }) => row.original.waliKelas?.name ?? row.original.waliKelas?.email ?? '-',
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
