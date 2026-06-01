import { Search, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAssignableScopeOptions, getRoleFilterOptions, getUsersHref, statusFilterOptions, UserFilterOptions } from '../../HelperUser';
import { Table } from '@tanstack/react-table';
import type { User, UserFilter, UserScope } from '../../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { Permissions } from '@/lib/helper/permission.helper';
import { BulkUploadUserDialog } from '../BulkUploadUserDialog';

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
  const createPermission = scope === 'MITRA' ? Permissions.userPermissions.createUserMitra : Permissions.userPermissions.createUserInsidia;
  const canCreateUser = currentProfile.insidiaRole === 'SUPER_ADMIN' || currentProfile.permissions.includes(createPermission);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="rounded-xl border border-border/60 bg-slate-50 p-3 lg:flex-1">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="bg-white pl-9" onChange={(event) => onGlobalFilterChange(event.target.value)} placeholder="Cari nama, email, role, status..." value={globalFilter} />
          </div>
          <Select onValueChange={(value) => onScopeChange(value as UserScope)} value={scope}>
            <SelectTrigger className="w-full bg-white">
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
            <SelectTrigger className="w-full bg-white">
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
            <SelectTrigger className="w-full bg-white">
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
            <SelectTrigger className="w-full bg-white">
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
      </div>

      {canCreateUser ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <BulkUploadUserDialog currentProfile={currentProfile} scope={scope} />
          <Button asChild variant="insidia">
            <Link href={getUsersHref(currentProfile.mitraRoles?.mitraSlug ?? null, 'users/create')}>
              <Plus className="size-4" />
              Tambah User
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
};
