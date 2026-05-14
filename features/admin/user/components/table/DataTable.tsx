import { useState } from 'react';
import { User } from '../../types/user.types';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, ColumnFiltersState, ColumnDef } from '@tanstack/react-table';
import { getUserRole } from '../HelperUser';
type UserTableProps = {
  users: User[];
  columns: ColumnDef<User>[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
};
export const DataTable = ({ users, columns, globalFilter, setGlobalFilter }: UserTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  return useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const keyword = String(filterValue).trim().toLowerCase();

      if (!keyword) {
        return true;
      }

      const user = row.original;
      return [user.name, user.email, getUserRole(user), user.status].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
};
