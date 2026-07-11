import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { formatMitraDate, formatMitraStatus, formatMitraType, getMitraStatusVariant } from '../../lib/mitra.helper';
import type { Mitra } from '../../types/mitras.types';

type UseMitraColumnsProps = {
  onDeleteRequest: (mitraId: string) => void;
};

export function useMitraColumns({ onDeleteRequest }: UseMitraColumnsProps) {
  return useMemo<ColumnDef<Mitra>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Nama Mitra
            <ArrowUpDown className="size-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const mitra = row.original;

          return (
            <div className="min-w-[220px]">
              <p className="font-medium text-foreground">{mitra.name}</p>
              <p className="text-xs text-muted-foreground">{mitra.slug}</p>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Tipe',
        cell: ({ row }) => <p className="text-sm text-muted-foreground">{formatMitraType(row.original.type)}</p>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={getMitraStatusVariant(row.original.status)}>{formatMitraStatus(row.original.status)}</Badge>,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Dibuat
            <ArrowUpDown className="size-4" />
          </Button>
        ),
        cell: ({ row }) => formatMitraDate(row.original.createdAt),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const mitra = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Buka menu aksi</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/mitras/${mitra.id}`} className="flex items-center gap-2">
                      <Eye className="size-4" />
                      Detail
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={`/admin/mitras/${mitra.id}/edit`} className="flex items-center gap-2">
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  {mitra.deletedAt === null && (
                    <DropdownMenuItem onClick={() => onDeleteRequest(mitra.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="size-4" />
                      Hapus Mitra
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onDeleteRequest],
  );
}
