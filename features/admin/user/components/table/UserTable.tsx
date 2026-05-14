'use client';

import { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User, UserFilter, UserScope } from '../../types/user.types';
import { DataTable } from './DataTable';
import { useUserColumns } from './Colums';
import { HeaderTable } from './HeaderTable';
import { UserDeleteDialog } from '../UserDeleteDialog';
import type { SetUserFilter, SetUserScope } from '../UsersPage';
type UserTableProps = {
  currentUserRole?: string | null;
  users: User[];
  filter: UserFilter;
  setFilter: SetUserFilter;
  scope: UserScope;
  setUserScope: SetUserScope;
};

export function UserTable({ currentUserRole, users, filter, setFilter, scope, setUserScope }: UserTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScope, setSelectedUserScope] = useState<UserScope>('PLATFORM');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const columns = useUserColumns({ currentUserRole, setSelectedUserId, setSelectedUserScope, setIsDeleteOpen });
  const table = DataTable({ users, columns, globalFilter, setGlobalFilter });
  return (
    <>
      <div className="space-y-4">
        <HeaderTable currentUserRole={currentUserRole} table={table} setGlobalFilter={setGlobalFilter} globalFilter={globalFilter} filter={filter} setFilter={setFilter} scope={scope} setUserScope={setUserScope} />
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
        scope={selectedUserScope}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={() => {
          setSelectedUserId(null);
          setSelectedUserScope('PLATFORM');
        }}
      />
    </>
  );
}
