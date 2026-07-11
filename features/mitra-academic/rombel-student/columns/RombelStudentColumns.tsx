import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import type { ClassGroupStudent } from '../types/rombel-student.types';

type RombelStudentColumnsProps = {
  setEditingItem: (item: ClassGroupStudent | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: ClassGroupStudent | null) => void;
};

export function RombelStudentColumns({ setEditingItem, setIsFormOpen, setDeletingItem }: RombelStudentColumnsProps): ColumnDef<ClassGroupStudent>[] {
  return [
    {
      accessorKey: 'classGroup.name',
      header: 'Kelas',
      cell: ({ row }) => <span className="font-medium">{row.original.classGroup.name}</span>,
    },
    {
      accessorKey: 'student.name',
      header: 'Siswa',
      cell: ({ row }) => row.original.student?.name ?? row.original.student?.email ?? '-',
    },
    {
      accessorKey: 'academicYear.name',
      header: 'Periode',
      cell: ({ row }) => `${row.original.academicYear.name} - ${row.original.semester.name}`,
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
