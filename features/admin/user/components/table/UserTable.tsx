'use client';

import { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User, UserFilter } from '../../types/user.types';
import { DataTable } from './DataTable';
import { useUserColumns } from './Colums';
import { HeaderTable } from './HeaderTable';
import { UserDeleteDialog } from '../UserDeleteDialog';
import type { SetUserFilter } from '../UsersPage';
type UserTableProps = {
  users: User[];
  filter: UserFilter;
  setFilter: SetUserFilter;
};

export function UserTable({ users, filter, setFilter }: UserTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const columns = useUserColumns({ setSelectedUserId, setIsDeleteOpen });
  const table = DataTable({ users, columns, globalFilter, setGlobalFilter });
  return (
    <>
      <div className="space-y-4">
        <HeaderTable table={table} setGlobalFilter={setGlobalFilter} globalFilter={globalFilter} filter={filter} setFilter={setFilter} />
        <div className="rounded-xl border bg-background">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                    Tidak ada user yang cocok dengan filter saat ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <UserDeleteDialog
        userId={selectedUserId}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={() => {
          setSelectedUserId(null);
        }}
      />
    </>
  );
}
