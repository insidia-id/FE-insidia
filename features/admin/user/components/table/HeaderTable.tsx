import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { roleFilterOptions, statusFilterOptions, UserFilterOptions } from '../HelperUser';
import { Table } from '@tanstack/react-table';
import type { SetUserFilter } from '../UsersPage';
import type { User, UserFilter } from '../../types/user.types';
type HeaderTableProps = {
  table: Table<User>;
  setGlobalFilter: (value: string) => void;
  globalFilter: string;
  filter: UserFilter;
  setFilter: SetUserFilter;
};
export const HeaderTable = ({ table, setGlobalFilter, globalFilter, filter, setFilter }: HeaderTableProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Cari nama, email, role, status..." value={globalFilter} />
        </div>

        <Select
          onValueChange={(value) => {
            table.getColumn('status')?.setFilterValue(value === 'all' ? undefined : value);
          }}
          value={(table.getColumn('status')?.getFilterValue() as string | undefined) ?? 'all'}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            {statusFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            table.getColumn('role')?.setFilterValue(value === 'all' ? undefined : value);
          }}
          value={(table.getColumn('role')?.getFilterValue() as string | undefined) ?? 'all'}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent>
            {roleFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setFilter(value as UserFilter)}
          value={filter}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter user" />
          </SelectTrigger>
          <SelectContent>
            {UserFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button asChild variant="insidia">
        <Link href="/admin/users/create">
          <Plus className="size-4" />
          Tambah User
        </Link>
      </Button>
    </div>
  );
};
