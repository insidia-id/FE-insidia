'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateMitraController } from '../controller/CreateMitraController';
import { MitraFormFields } from '../form/MitraForm';
import type { CreateMitraInput } from '../schema/mitra.schema';

export function CreateMitraPage() {
  const router = useRouter();
  const { form, isSubmitting, onSubmit } = CreateMitraController();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen Mitra</p>
          <h1 className="text-3xl font-semibold text-foreground">Tambah Mitra</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Buat data mitra baru agar entitas tersebut segera tersedia dalam daftar manajemen admin.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Mitra</CardTitle>
            <CardDescription>Isi data dasar mitra terlebih dahulu sebelum menyimpan.</CardDescription>
          </CardHeader>
          <CardContent>
            <MitraFormFields<CreateMitraInput>
              form={form}
              isLoading={isSubmitting}
              onCancel={() => {
                if (window.history.length > 1) {
                  router.back();
                  return;
                }

                router.push('/admin/mitras');
              }}
              onSubmit={(data) => {
                onSubmit(data, (mitraId) => {
                  router.push(`/admin/mitras/${mitraId}`);
                });
              }}
              submitLabel="Simpan Mitra"
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
