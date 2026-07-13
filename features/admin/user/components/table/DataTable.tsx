import { useState } from 'react';
import { User, UserScope } from '../../types/user.types';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, ColumnFiltersState, ColumnDef } from '@tanstack/react-table';
import { getUserRole } from '../../HelperUser';
import { PaginationState, OnChangeFn } from '@tanstack/react-table';
type UserTableProps = {
  users: User[];
  columns: ColumnDef<User>[];
  scope: UserScope;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  total: number;
};

export const useUserDataTable = ({ users, columns, scope, globalFilter, onGlobalFilterChange, onPaginationChange, pagination, total }: UserTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  return useReactTable({
    data: users,
    columns,
    manualPagination: true,
    rowCount: total,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange,
    globalFilterFn: (row, _columnId, filterValue) => {
      const keyword = String(filterValue).trim().toLowerCase();

      if (!keyword) {
        return true;
      }

      const user = row.original;
      return [user.name, user.email, getUserRole(user, scope), user.status].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword));
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
};
