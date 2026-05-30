import { Search, Plus } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MITRA_STATUS_FILTER_OPTIONS, MITRA_TYPES, MITRA_VISIBILITY_OPTIONS } from '../../lib/mitra.helper';
import type { Mitra, MitraVisibilityFilter } from '../../types/mitras.types';

type HeaderTableProps = {
  table: Table<Mitra>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  visibilityFilter: MitraVisibilityFilter;
  onVisibilityFilterChange: (value: MitraVisibilityFilter) => void;
};

export function HeaderTable({ table, globalFilter, onGlobalFilterChange, visibilityFilter, onVisibilityFilterChange }: HeaderTableProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" onChange={(event) => onGlobalFilterChange(event.target.value)} placeholder="Cari nama, slug, tipe, status..." value={globalFilter} />
        </div>

        <Select onValueChange={(value) => onVisibilityFilterChange(value as MitraVisibilityFilter)} value={visibilityFilter}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter data" />
          </SelectTrigger>
          <SelectContent>
            {MITRA_VISIBILITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            table.getColumn('type')?.setFilterValue(value === 'all' ? undefined : value);
          }}
          value={(table.getColumn('type')?.getFilterValue() as string | undefined) ?? 'all'}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter tipe" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>

            {MITRA_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value);
          }}
          value={(table.getColumn('status')?.getFilterValue() as string | undefined) ?? 'all'}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {MITRA_STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button asChild variant="insidia">
        <Link href="/admin/mitras/create">
          <Plus className="size-4" />
          Tambah Mitra
        </Link>
      </Button>
    </div>
  );
}
