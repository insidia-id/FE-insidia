'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Plus, Upload, MoreHorizontal } from 'lucide-react';

import { UserTable } from '../components/table/UserTable';
import { UsersController } from '../hooks/UsersController';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserManagementPageConfig } from '../config/user-page.config';

// Pastikan import canManage dan Permissions ditambahkan di sini
import { getActiveMitraContext, getUsersHref, canManage } from '../HelperUser';
import { Permissions } from '@/lib/helper/permission.helper';

type UsersPageProps = {
  currentProfile: AuthProfileResponse;
  pageConfig: UserManagementPageConfig;
};

export function UsersPage({ currentProfile, pageConfig }: UsersPageProps) {
  const { activeMitraSlug } = getActiveMitraContext(currentProfile);
  
  const { filter, scope, roleCode, search, total, visibleUsers, isLoading, isError, error, onFilterChange, onScopeChange, onRoleCodeChange, onSearchChange } = UsersController(currentProfile, pageConfig);
  
  const createSearchParams = new URLSearchParams();
  const bulkUploadSearchParams = new URLSearchParams();

  if (scope) {
    createSearchParams.set('scope', scope);
    bulkUploadSearchParams.set('scope', scope);
  }

  if (pageConfig.roleCode) {
    createSearchParams.set('role', pageConfig.roleCode);
    bulkUploadSearchParams.set('role', pageConfig.roleCode);
  }

  const createHref = `${getUsersHref(activeMitraSlug, 'users/create')}${createSearchParams.toString() ? `?${createSearchParams.toString()}` : ''}`;
  const bulkUploadHref = `${getUsersHref(activeMitraSlug, 'users/bulk-upload')}${bulkUploadSearchParams.toString() ? `?${bulkUploadSearchParams.toString()}` : ''}`;

  const canManages = canManage(currentProfile, [Permissions.userPermissions.create[scope]]);

  return (
    <main className="min-h-screen bg-[#F8F9FB] px-4 py-8 md:p-8 lg:p-10 font-sans">
      <section className="mx-auto w-full space-y-6">
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{pageConfig.title}</h1>
              <p className="text-sm  text-slate-500">{pageConfig.description}</p>
            </div>
            {canManages ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-slate-700 font-semibold shadow-sm hover:bg-slate-50 gap-2 px-4 transition-all" asChild>
                    <Link href={bulkUploadHref}>
                      <Upload className="h-4 w-4 text-slate-400" />
                      {pageConfig.bulkUploadLabel}
                    </Link>
                  </Button>

                  <Button className="h-10 rounded-xl bg-[#7527D6] hover:bg-[#7527D6]/90 text-white font-semibold shadow-md px-5 gap-2 transition-all" asChild>
                    <Link href={createHref}>
                      <Plus className="h-4 w-4" />
                      {pageConfig.createLabel}
                    </Link>
                  </Button>
                </div>

              </div>
            ) : null}
          </div>

        <Card className="border-0 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[24px] overflow-hidden mt-2">
          <CardContent className="p-4 sm:p-6 bg-white">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-md rounded-lg" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600">
                {error instanceof Error ? error.message : 'Gagal memuat data user.'}
              </div>
            ) : (
              <UserTable
                currentProfile={currentProfile}
                users={visibleUsers}
                total={total}
                pageConfig={pageConfig}
                filter={filter}
                onFilterChange={onFilterChange}
                scope={scope}
                onScopeChange={onScopeChange}
                roleCode={roleCode}
                onRoleCodeChange={onRoleCodeChange}
                search={search}
                onSearchChange={onSearchChange}
                createHref={createHref}
                bulkUploadHref={bulkUploadHref}
              />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}