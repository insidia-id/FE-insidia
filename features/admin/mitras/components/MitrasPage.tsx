'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MitrasController } from '../controller/MitrasController';
import { MitraTable } from './table/MitraTable';

export function MitrasPage() {
  const { visibilityFilter, visibleMitras, isLoading, isError, error, onVisibilityFilterChange } = MitrasController();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen Mitra</p>
          <h1 className="text-3xl font-semibold text-foreground">Semua Mitra</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Pantau seluruh data mitra, cari entitas yang dibutuhkan, lalu kelola daftar aktif maupun yang sudah terhapus dari satu tempat.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Mitra</CardTitle>
            <CardDescription>{isLoading ? 'Memuat data mitra...' : `${visibleMitras.length} mitra ditemukan`}</CardDescription>
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
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat data mitra.'}</div>
            ) : (
              <MitraTable mitras={visibleMitras} visibilityFilter={visibilityFilter} onVisibilityFilterChange={onVisibilityFilterChange} />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
