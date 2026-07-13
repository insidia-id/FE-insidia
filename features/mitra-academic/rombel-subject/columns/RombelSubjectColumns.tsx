import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import type { ClassGroupCourse } from '../types/rombel-subject.types';

type RombelSubjectColumnsProps = {
  setEditingItem: (item: ClassGroupCourse | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: ClassGroupCourse | null) => void;
};

export function RombelSubjectColumns({ setEditingItem, setIsFormOpen, setDeletingItem }: RombelSubjectColumnsProps): ColumnDef<ClassGroupCourse>[] {
  return [
    {
      accessorKey: 'classGroup.name',
      header: 'Kelas',
      cell: ({ row }) => <span className="font-medium">{row.original.classGroup?.name ?? 'N/A'}</span>,
    },
    {
      accessorKey: 'subject.name',
      header: 'Mata Pelajaran',
      cell: ({ row }) => {
        const subjectName = row.original.course?.title ?? 'N/A';
        return <span className="font-medium">{subjectName}</span>;
      },
    },
    {
      accessorKey: 'teacher.name',
      header: 'Guru',
      cell: ({ row }) => row.original.teacher?.name ?? row.original.teacher?.email,
    },
    {
      accessorKey: 'semester.name',
      header: 'Periode',
      cell: ({ row }) => `${row.original.academicYear?.name ?? 'N/A'} - ${row.original.semester?.name ?? 'N/A'}`,
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
