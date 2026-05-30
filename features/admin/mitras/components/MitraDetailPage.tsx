'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, CalendarDays, Hash, MoreVertical, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MitraDetailController } from '../controller/MitraDetailController';
import { MitraDeleteDialog } from './MitraDeleteDialog';
import { formatMitraDate, formatMitraStatus, formatMitraType, getMitraStatusVariant } from '../lib/mitra.helper';
import { useDeleteMitra } from '../hooks/useMitras';

type MitraDetailPageProps = {
  mitraId: string;
};

export function MitraDetailPage({ mitraId }: MitraDetailPageProps) {
  const router = useRouter();
  const { mitra, isLoading, isError, error, isDeleteOpen, onDeleteDialogChange } = MitraDetailController(mitraId);
  const deleteMitraMutation = useDeleteMitra();

  return (
    <>
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <section className="mx-auto w-full max-w-4xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen Mitra</p>
              <h1 className="text-3xl font-semibold text-foreground">Detail Mitra</h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Lihat ringkasan data mitra yang sudah tersimpan, lalu lanjutkan ke edit atau hapus bila diperlukan.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/admin/mitras">
                  <ArrowLeft className="size-4" />
                  Kembali ke daftar
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Informasi Mitra</CardTitle>
                  <CardDescription>Ringkasan identitas, slug, status, dan jejak waktu data mitra.</CardDescription>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="size-4" />
                      <span className="sr-only">Buka menu aksi</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/mitras/${mitraId}/edit`} className="flex items-center gap-2">
                        <Pencil className="size-4" />
                        Edit Mitra
                      </Link>
                    </DropdownMenuItem>

                    {mitra?.deletedAt === null && (
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteDialogChange(true)}>
                        <Trash2 className="size-4" />
                        Hapus Mitra
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : isError ? (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat detail mitra.'}</div>
              ) : mitra ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Mitra ID</p>
                  <p className="font-mono text-sm text-foreground">{mitra.id}</p>
                  <h2 className="text-2xl font-semibold text-foreground">{mitra.name}</h2>
                  <p className="text-sm text-muted-foreground">Tipe mitra: {formatMitraType(mitra.type)}</p>
                </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge className="h-7 px-3 text-sm" variant={getMitraStatusVariant(mitra.status)}>
                        {formatMitraStatus(mitra.status)}
                      </Badge>
                      {mitra.deletedAt && (
                        <Badge className="h-7 px-3 text-sm" variant="destructive">
                          Terhapus
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <Building2 className="size-4" />
                        <p className="font-medium">Nama Mitra</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{mitra.name}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <ShieldCheck className="size-4" />
                        <p className="font-medium">Tipe Mitra</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatMitraType(mitra.type)}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <Hash className="size-4" />
                        <p className="font-medium">Slug</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{mitra.slug || '-'}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <CalendarDays className="size-4" />
                        <p className="font-medium">Dibuat Pada</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatMitraDate(mitra.createdAt)}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <CalendarDays className="size-4" />
                        <p className="font-medium">Diupdate Pada</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatMitraDate(mitra.updatedAt)}</p>
                    </div>

                    <div className="rounded-xl border p-5">
                      <div className="mb-3 flex items-center gap-2 text-foreground">
                        <CalendarDays className="size-4" />
                        <p className="font-medium">Deleted At</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{formatMitraDate(mitra.deletedAt)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border p-4 text-sm text-muted-foreground">Data mitra tidak ditemukan.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <MitraDeleteDialog
        open={isDeleteOpen}
        onOpenChange={onDeleteDialogChange}
        isLoading={deleteMitraMutation.isPending}
        onConfirm={() => {
          if (!mitra) {
            return;
          }

          deleteMitraMutation.mutate(mitra.id, {
            onSuccess: () => {
              onDeleteDialogChange(false);
              router.push('/admin/mitras');
            },
          });
        }}
      />
    </>
  );
}
