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
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen User</p>
          <h1 className="text-3xl font-semibold text-foreground">Semua User</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Pantau seluruh akun user, cari data yang dibutuhkan, lalu buka detail user untuk melihat informasi lebih lengkap.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar User</CardTitle>
            <CardDescription>{isLoading ? 'Memuat data user...' : `${visibleUsers.length} user ditemukan`}</CardDescription>
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
