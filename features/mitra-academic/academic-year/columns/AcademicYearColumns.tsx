import { ColumnDef } from '@tanstack/react-table';
import { AcademicYear } from '../types/academic-year.types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { formatDateRange } from '../../shared/lib/formatters';
type AcademicYearColumsProps = {
  setEditingItem: (item: AcademicYear | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setDeletingItem: (item: AcademicYear | null) => void;
};
export const columns = ({ setEditingItem, setIsFormOpen, setDeletingItem }: AcademicYearColumsProps): ColumnDef<AcademicYear>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Nama Tahun Ajaran',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'period',
      header: 'Periode',
      cell: ({ row }) => formatDateRange(row.original.startDate, row.original.endDate),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Aksi',
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
};
