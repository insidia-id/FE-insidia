'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserTable } from './table/UserTable';
import { UsersController } from '../controller/UsersController';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

type UsersPageProps = {
  currentProfile: AuthProfileResponse;
};

export function UsersPage({ currentProfile }: UsersPageProps) {
  const { filter, scope, visibleUsers, isLoading, isError, error, onFilterChange, onScopeChange } = UsersController(currentProfile);
  console.log(` visibleUsers: ${visibleUsers}`);
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_40%)] px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Manajemen User</p>
              <h1 className="text-3xl font-semibold text-foreground">Semua User</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Pantau seluruh akun user, cari data yang dibutuhkan, lalu buka detail user untuk melihat informasi lebih lengkap.</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-slate-50 px-4 py-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total tampil</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{isLoading ? '-' : visibleUsers.length}</p>
            </div>
          </div>
        </div>

        <Card className="border-border/70 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Daftar User</CardTitle>
              <CardDescription>{isLoading ? 'Memuat data user...' : `${visibleUsers.length} user ditemukan`}</CardDescription>
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
              <UserTable currentProfile={currentProfile} users={visibleUsers} filter={filter} onFilterChange={onFilterChange} scope={scope} onScopeChange={onScopeChange} />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
