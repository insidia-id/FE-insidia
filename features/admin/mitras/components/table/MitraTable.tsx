'use client';

import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MitraDeleteDialog } from '../MitraDeleteDialog';
import { MitraTableController } from '../../controller/MitraTableController';
import { HeaderTable } from './HeaderTable';
import type { Mitra, MitraVisibilityFilter } from '../../types/mitras.types';

type MitraTableProps = {
  mitras: Mitra[];
  visibilityFilter: MitraVisibilityFilter;
  onVisibilityFilterChange: (value: MitraVisibilityFilter) => void;
};

export function MitraTable({ mitras, visibilityFilter, onVisibilityFilterChange }: MitraTableProps) {
  const { columns, table, globalFilter, isDeleteOpen, isDeleting, onConfirmDelete, onDeleteDialogChange, onGlobalFilterChange } = MitraTableController({ mitras });

  return (
    <>
      <div className="space-y-4">
        <HeaderTable table={table} globalFilter={globalFilter} onGlobalFilterChange={onGlobalFilterChange} visibilityFilter={visibilityFilter} onVisibilityFilterChange={onVisibilityFilterChange} />
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
                    Tidak ada mitra yang cocok dengan filter saat ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <MitraDeleteDialog open={isDeleteOpen} onOpenChange={onDeleteDialogChange} onConfirm={onConfirmDelete} isLoading={isDeleting} />
    </>
  );
}
