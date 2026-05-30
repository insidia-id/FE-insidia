'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdateMitraController } from '../controller/UpdateMitraController';
import { MitraFormFields } from '../form/MitraForm';
import type { UpdateMitraInput } from '../schema/mitra.schema';

type UpdateMitraPageProps = {
  mitraId: string;
};

export function UpdateMitraPage({ mitraId }: UpdateMitraPageProps) {
  const router = useRouter();
  const { form, mitra, isLoading, isError, error, isSubmitting, onSubmit } = UpdateMitraController(mitraId);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen Mitra</p>
          <h1 className="text-3xl font-semibold text-foreground">Edit Mitra</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Perbarui informasi dasar mitra supaya data yang tampil di panel admin tetap akurat.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Update Mitra</CardTitle>
            <CardDescription>{mitra ? `Mengubah data untuk ${mitra.name}` : 'Memuat data mitra...'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-28 w-full" />
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat data mitra untuk diedit.'}</div>
            ) : (
              <MitraFormFields<UpdateMitraInput>
                form={form}
                isLoading={isSubmitting}
                onCancel={() => {
                  router.push(`/admin/mitras/${mitraId}`);
                }}
                onSubmit={(data) => {
                  onSubmit(data, (updatedMitraId) => {
                    router.push(`/admin/mitras/${updatedMitraId}`);
                  });
                }}
                submitLabel="Simpan Perubahan"
              />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
