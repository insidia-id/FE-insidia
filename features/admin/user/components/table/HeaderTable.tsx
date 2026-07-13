'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getActiveMitraContext, getAssignableScopeOptions, getRoleFilterOptions, UserFilterOptions } from '../../HelperUser';
import { Table } from '@tanstack/react-table';
import type { RoleUser, User, UserFilter, UserScope } from '../../types/user.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
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

export const HeaderTable = ({ currentProfile, pageConfig, table, onGlobalFilterChange, globalFilter, filter, onFilterChange, scope, onScopeChange, roleCode, onRoleCodeChange }: HeaderTableProps) => {
  const { activeInsidiaRole, activeMitraRole } = getActiveMitraContext(currentProfile);

  const roleFilterOptions = getRoleFilterOptions(activeMitraRole ?? activeInsidiaRole, scope);
  const getCurrentScope = getAssignableScopeOptions(activeMitraRole ?? activeInsidiaRole);

  const showScopeFilter = pageConfig.allowScopeFilter && !activeMitraRole;

  return (
    <div className="w-full mb-4">
      <div className="rounded-2xl ">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
          }}
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="bg-slate-50/50 border-slate-200/80 rounded-xl pl-9 placeholder:text-slate-400 focus-visible:ring-slate-200 text-sm h-10"
              onChange={(event) => onGlobalFilterChange(event.target.value)}
              placeholder="Cari nama, email, role..."
              value={globalFilter}
            />
          </div>

          {showScopeFilter ? (
            <Select
              onValueChange={(value) => {
                onScopeChange(value as UserScope);
                table.getColumn('role')?.setFilterValue(undefined);
              }}
              value={scope}
            >
              <SelectTrigger className="w-full h-10 bg-slate-50/50 border-slate-200/80 rounded-xl text-slate-600 font-medium text-sm focus:ring-slate-200">
                <SelectValue placeholder="Filter scope" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-md">
                {getCurrentScope.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-medium cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          {pageConfig.allowRoleFilter ? (
            <Select onValueChange={(value) => onRoleCodeChange(value as RoleUser)} value={roleCode}>
              <SelectTrigger className="w-full h-10 bg-slate-50/50 border-slate-200/80 rounded-xl text-slate-600 font-medium text-sm focus:ring-slate-200">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-md">
                {roleFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="font-medium cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <Select onValueChange={(value) => onFilterChange(value as UserFilter)} value={filter}>
            <SelectTrigger className="w-full h-10 bg-slate-50/50 border-slate-200/80 rounded-xl text-slate-600 font-medium text-sm focus:ring-slate-200">
              <SelectValue placeholder="Filter tipe user" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-md">
              {UserFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-medium cursor-pointer">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
