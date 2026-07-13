'use client';

import { flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HeaderTable } from './HeaderTable';
import { useCourseTable } from '../../hooks/useCouseTable';
import { CourseDetail } from '../../types/course.types';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';
import { MitraDeleteDialog } from '@/features/admin/mitras/components/MitraDeleteDialog';

type CourseTableProps = {
  courses: CourseDetail[];
  scope: AccessScope;
  onScopeChange: (value: AccessScope) => void;
  canChangeScope?: boolean;
  mitraSlug: string | null;
};

export function CourseTable({ courses, scope, onScopeChange, canChangeScope, mitraSlug }: CourseTableProps) {
  const { columns, table, globalFilter, isDeleteOpen, isDeleting, onConfirmDelete, onDeleteDialogChange, onGlobalFilterChange } = useCourseTable({ courses, scope, mitraSlug });

  return (
    <>
      <div className="space-y-4">
        <HeaderTable globalFilter={globalFilter} onGlobalFilterChange={onGlobalFilterChange} scope={scope} onScopeChange={onScopeChange} canChangeScope={canChangeScope} mitraSlug={mitraSlug} />
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
                    Tidak ada kursus yang cocok dengan filter saat ini.
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
