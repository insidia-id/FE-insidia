import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAssignableScopeOptions, getRoleFilterOptions, getUsersHref, statusFilterOptions, UserFilterOptions } from '../../HelperUser';
import { Table } from '@tanstack/react-table';
import type { User, UserFilter, UserScope } from '../../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

type HeaderTableProps = {
  currentProfile: AuthProfileResponse;
  table: Table<User>;
  onGlobalFilterChange: (value: string) => void;
  globalFilter: string;
  filter: UserFilter;
  onFilterChange: (filter: UserFilter) => void;
  scope: UserScope;
  onScopeChange: (scope: UserScope) => void;
};
export const HeaderTable = ({ currentProfile, table, onGlobalFilterChange, globalFilter, filter, onFilterChange, scope, onScopeChange }: HeaderTableProps) => {
  const currentUserRole = currentProfile.mitraRoles?.roleCode ?? currentProfile.insidiaRole ?? null;
  const roleFilterOptions = getRoleFilterOptions(currentUserRole);
  const getCurrentScope = getAssignableScopeOptions(currentUserRole);
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" onChange={(event) => onGlobalFilterChange(event.target.value)} placeholder="Cari nama, email, role, status..." value={globalFilter} />
        </div>
        <Select onValueChange={(value) => onScopeChange(value as UserScope)} value={scope}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Filter scope" />
          </SelectTrigger>
          <SelectContent>
            {getCurrentScope.map((option) => (
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
        <Select onValueChange={(value) => onFilterChange(value as UserFilter)} value={filter}>
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
        <Link href={getUsersHref(currentProfile.mitraRoles?.mitraSlug ?? null, 'users/create')}>
          <Plus className="size-4" />
          Tambah User
        </Link>
      </Button>
    </div>
  );
};
