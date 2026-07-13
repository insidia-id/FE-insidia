import { useState } from 'react';
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

type UseDataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  globalFilterFn: FilterFn<T>;
  defaultSorting?: SortingState;
};

export function useDataTable<T>({ data, columns, globalFilter, onGlobalFilterChange, globalFilterFn, defaultSorting = [] }: UseDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return useReactTable({
    data,
    columns,

    state: {
      sorting,
      columnFilters,
      globalFilter,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange,

    globalFilterFn,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
}
