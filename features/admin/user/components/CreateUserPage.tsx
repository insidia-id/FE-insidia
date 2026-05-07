'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserController } from '../controller/CreateUserController';
import { UserFormFields } from '../form/UserForm';
import { CreateUserInput } from '../schema/user.schema';

export function CreateUserPage() {
  const router = useRouter();
  const { form, isSubmitting, onSubmit } = CreateUserController();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen User</p>
          <h1 className="text-3xl font-semibold text-foreground">Tambah User</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Buat akun user baru dan tentukan role serta status awalnya dari halaman ini.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form User</CardTitle>
            <CardDescription>Isi data dasar user terlebih dahulu sebelum menyimpan.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserFormFields<CreateUserInput>
              form={form}
              isLoading={isSubmitting}
              mode="create"
              onCancel={() => {
                if (window.history.length > 1) {
                  router.back();
                  return;
                }

                router.push('/admin');
              }}
              onSubmit={onSubmit}
              submitLabel="Simpan User"
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
