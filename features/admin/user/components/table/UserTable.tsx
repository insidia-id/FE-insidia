'use client';

import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { RoleUser, User, UserFilter, UserScope } from '../../types/user.types';
import { HeaderTable } from './HeaderTable';
import { UserDeleteDialog } from '../UserDeleteDialog';
import { UserTableController } from '../../controller/UserTableController';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserManagementPageConfig } from '../../config/user-page.config';

type UserTableProps = {
  currentProfile: AuthProfileResponse;
  users: User[];
  total: number;
  pageConfig: UserManagementPageConfig;
  filter: UserFilter;
  onFilterChange: (filter: UserFilter) => void;
  scope: UserScope;
  onScopeChange: (scope: UserScope) => void;
  roleCode: RoleUser;
  onRoleCodeChange: (roleCode: RoleUser) => void;
  search: string;
  onSearchChange: (value: string) => void;
  createHref: string;
  bulkUploadHref: string;
};

export function UserTable({ currentProfile, users, total, pageConfig, filter, onFilterChange, scope, onScopeChange, roleCode, onRoleCodeChange, search, onSearchChange, createHref, bulkUploadHref }: UserTableProps) {
  const { columns, table, selectedUserId, selectedUserScope, isDeleteOpen, onDeleteDialogChange, onDeleteSuccess } = UserTableController({
    currentProfile,
    users,
    scope,
    columnIds: pageConfig.columns,
    globalFilter: search,
    onGlobalFilterChange: onSearchChange,
  });
  return (
    <>
      <div className="space-y-4">
        <HeaderTable
          currentProfile={currentProfile}
          pageConfig={pageConfig}
          table={table}
          onGlobalFilterChange={onSearchChange}
          globalFilter={search}
          filter={filter}
          onFilterChange={onFilterChange}
          scope={scope}
          onScopeChange={onScopeChange}
          roleCode={roleCode}
          onRoleCodeChange={onRoleCodeChange}
          createHref={createHref}
          bulkUploadHref={bulkUploadHref}
        />
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
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{pageConfig.emptyTitle}</p>
                      <p>{pageConfig.emptyDescription}</p>
                      {total > 0 ? <p className="text-xs">Coba ubah kata kunci pencarian atau filter tabel.</p> : null}
                    </div>
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
