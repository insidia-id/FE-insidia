import { useState } from 'react';
import { ColumnDef, ColumnFiltersState, SortingState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { Mitra } from '../../types/mitras.types';

type MitraDataTableProps = {
  mitras: Mitra[];
  columns: ColumnDef<Mitra>[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
};

export function useMitraDataTable({ mitras, columns, globalFilter, onGlobalFilterChange }: MitraDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return useReactTable({
    data: mitras,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange,
    globalFilterFn: (row, _columnId, filterValue) => {
      const keyword = String(filterValue).trim().toLowerCase();

      if (!keyword) {
        return true;
      }

      const mitra = row.original;

      return [mitra.name, mitra.slug, mitra.type, mitra.status].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
}
