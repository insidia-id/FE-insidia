import { useState } from 'react';
import { useDeleteMitra } from '../hooks/useMitras';
import { useMitraColumns } from '../components/table/Columns';
import { useMitraDataTable } from '../components/table/DataTable';
import type { Mitra } from '../types/mitras.types';

type MitraTableControllerProps = {
  mitras: Mitra[];
};

export function MitraTableController({ mitras }: MitraTableControllerProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedMitraId, setSelectedMitraId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteMitraMutation = useDeleteMitra();

  const columns = useMitraColumns({
    onDeleteRequest: (mitraId) => {
      setSelectedMitraId(mitraId);
      setIsDeleteOpen(true);
    },
  });

  const table = useMitraDataTable({
    mitras,
    columns,
    globalFilter,
    onGlobalFilterChange: setGlobalFilter,
  });

  return {
    columns,
    globalFilter,
    isDeleteOpen,
    isDeleting: deleteMitraMutation.isPending,
    selectedMitraId,
    table,
    onConfirmDelete: () => {
      if (!selectedMitraId) {
        return;
      }

      deleteMitraMutation.mutate(selectedMitraId, {
        onSuccess: () => {
          setSelectedMitraId(null);
          setIsDeleteOpen(false);
        },
      });
    },
    onDeleteDialogChange: (open: boolean) => {
      setIsDeleteOpen(open);

      if (open) {
        return;
      }

      setSelectedMitraId(null);
    },
    onGlobalFilterChange: setGlobalFilter,
  };
}
