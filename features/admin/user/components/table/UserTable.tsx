'use client';

import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { User, UserFilter, UserScope } from '../../types/user.types';
import { HeaderTable } from './HeaderTable';
import { UserDeleteDialog } from '../UserDeleteDialog';
import { UserTableController } from '../../controller/UserTableController';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getUserRole } from '../../HelperUser';

type UserTableProps = {
  currentProfile: AuthProfileResponse;
  users: User[];
  filter: UserFilter;
  onFilterChange: (filter: UserFilter) => void;
  scope: UserScope;
  onScopeChange: (scope: UserScope) => void;
};

export function UserTable({ currentProfile, users, filter, onFilterChange, scope, onScopeChange }: UserTableProps) {
  const { columns, table, globalFilter, selectedUserId, selectedUserScope, isDeleteOpen, onDeleteDialogChange, onDeleteSuccess, onGlobalFilterChange } = UserTableController({
    currentProfile,
    users,
    scope,
  });
  console.log(getUserRole(users[0], scope), users[0]);
  return (
    <>
      <div className="space-y-4">
        <HeaderTable currentProfile={currentProfile} table={table} onGlobalFilterChange={onGlobalFilterChange} globalFilter={globalFilter} filter={filter} onFilterChange={onFilterChange} scope={scope} onScopeChange={onScopeChange} />
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
      <UserDeleteDialog userId={selectedUserId} scope={selectedUserScope} open={isDeleteOpen} onOpenChange={onDeleteDialogChange} onSuccess={onDeleteSuccess} />
    </>
  );
}
