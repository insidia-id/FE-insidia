import { Search, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { canManage, getActiveMitraContext, getAssignableScopeOptions, getRoleFilterOptions, statusFilterOptions, UserFilterOptions } from '../../HelperUser';
import { Table } from '@tanstack/react-table';
import type { RoleUser, User, UserFilter, UserScope } from '../../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { Permissions } from '@/lib/helper/permission.helper';
import type { UserManagementPageConfig } from '../../config/user-page.config';

type HeaderTableProps = {
  currentProfile: AuthProfileResponse;
  pageConfig: UserManagementPageConfig;
  table: Table<User>;
  onGlobalFilterChange: (value: string) => void;
  globalFilter: string;
  filter: UserFilter;
  onFilterChange: (filter: UserFilter) => void;
  scope: UserScope;
  onScopeChange: (scope: UserScope) => void;
  roleCode: RoleUser;
  onRoleCodeChange: (roleCode: RoleUser) => void;
  createHref: string;
  bulkUploadHref: string;
};
export const HeaderTable = ({ currentProfile, pageConfig, table, onGlobalFilterChange, globalFilter, filter, onFilterChange, scope, onScopeChange, roleCode, onRoleCodeChange, createHref, bulkUploadHref }: HeaderTableProps) => {
  const { activeInsidiaRole, activeMitraRole } = getActiveMitraContext(currentProfile);
  const roleFilterOptions = getRoleFilterOptions(activeMitraRole ?? activeInsidiaRole, scope);

  const getCurrentScope = getAssignableScopeOptions(activeMitraRole ?? activeInsidiaRole);

  const canManages = canManage(currentProfile, [Permissions.userPermissions.create[scope]]);
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="rounded-xl border border-border/60 bg-slate-50 p-3 lg:flex-1">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="bg-white pl-9" onChange={(event) => onGlobalFilterChange(event.target.value)} placeholder="Cari nama, email, role, status..." value={globalFilter} />
          </div>
          {pageConfig.allowScopeFilter ? (
            <Select
              onValueChange={(value) => {
                onScopeChange(value as UserScope);

                table.getColumn('role')?.setFilterValue(undefined);
              }}
              value={scope}
            >
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
          ) : null}
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

          {pageConfig.allowRoleFilter ? (
            <Select onValueChange={(value) => onRoleCodeChange(value as RoleUser)} value={roleCode}>
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
          ) : null}
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

      {canManages ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href={bulkUploadHref}>
              <Upload className="size-4" />
              {pageConfig.bulkUploadLabel}
            </Link>
          </Button>
          <Button asChild variant="insidia">
            <Link href={createHref}>
              <Plus className="size-4" />
              {pageConfig.createLabel}
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
};
