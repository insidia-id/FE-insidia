'use client';

import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { RoleUser, User, UserFilter, UserScope } from '../../types/user.types';
import { HeaderTable } from './HeaderTable';
import { UserDeleteDialog } from '../UserDeleteDialog';
import { UserTableController } from '../../hooks/UserTableController';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserManagementPageConfig } from '../../config/user-page.config';

// Import Dropdown untuk aksi sorting filter status di level kolom
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown } from 'lucide-react';

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
        {/* Di dalam komponen HeaderTable ini sisa input search dan filter role */}
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
        
        {/* Sisi Desain Table Tanpa Border Kasar */}
        <div className="rounded-xl border border-slate-100 bg-background overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/70">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-slate-100">
                  {headerGroup.headers.map((header) => {
                    const isStatusColumn = header.id.toLowerCase() === 'status';

                    return (
                      <TableHead key={header.id} className="text-slate-600 font-semibold h-11 py-2">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            
                            {/* POIN 3: MEMINDAHKAN FILTER STATUS MENJADI ICON SORTING DI KOLOM HEADER */}
                            {isStatusColumn && (
                              <DropdownMenu>
                                <DropdownMenuTrigger className="focus:outline-none p-1 rounded hover:bg-slate-200/60 transition-colors">
                                  <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="rounded-xl shadow-lg border-slate-100">
                                  <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => onFilterChange('ACTIVE' as any)}>Aktif</DropdownMenuItem>
                                  <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => onFilterChange('INACTIVE' as any)}>Nonaktif</DropdownMenuItem>
                                  <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => onFilterChange('' as any)}>Semua Status</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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