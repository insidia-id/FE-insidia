'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserTable } from '../components/table/UserTable';
import { UsersController } from '../hooks/UsersController';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserManagementPageConfig } from '../config/user-page.config';
import { getActiveMitraContext, getUsersHref } from '../HelperUser';

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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_40%)] px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Manajemen User</p>
              <h1 className="text-3xl font-semibold text-foreground">{pageConfig.title}</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{pageConfig.description}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-slate-50 px-4 py-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total user</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{isLoading ? '-' : total}</p>
            </div>
          </div>
        </div>

        <Card className="border-border/70 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Daftar User</CardTitle>
              <CardDescription>{isLoading ? 'Memuat data user...' : `${total} user ditemukan`}</CardDescription>
            </div>
            <p className="text-xs text-muted-foreground">Gunakan filter untuk mempersempit hasil.</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full max-w-sm" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat data user.'}</div>
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
