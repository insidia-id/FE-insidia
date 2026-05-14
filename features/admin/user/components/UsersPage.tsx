'use client';

import type { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetUsers } from '../hooks/useUser';
import { UserTable } from './table/UserTable';
import { useState } from 'react';
import type { UserFilter, UserScope } from '../types/user.types';
import { filterUsersByManageableRoles } from './HelperUser';

export type SetUserFilter = Dispatch<SetStateAction<UserFilter>>;
export type SetUserScope = Dispatch<SetStateAction<UserScope>>;

type UsersPageProps = {
  currentUserRole?: string | null;
};

export function UsersPage({ currentUserRole }: UsersPageProps) {
  const [filter, setFilter] = useState<UserFilter>('available');
  const [scope, setScope] = useState<UserScope>('PLATFORM');
  const { data: users = [], isLoading, isError, error } = useGetUsers(filter, scope);
  const visibleUsers = filterUsersByManageableRoles(users, currentUserRole);

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
              <UserTable currentUserRole={currentUserRole} users={visibleUsers} filter={filter} setFilter={setFilter} scope={scope} setUserScope={setScope} />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
