'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UpdateUserController } from '../controller/UpdateUserController';
import { UserFormFields } from '../form/UserForm';
import { UpdateUserInput } from '../schema/user.schema';

type UpdateUserPageProps = {
  currentUserRole?: string | null;
  userId: string;
  scope?: 'PLATFORM' | 'MITRA';
};

export function UpdateUserPage({ userId, currentUserRole, scope = 'PLATFORM' }: UpdateUserPageProps) {
  const router = useRouter();
  const { form, user, isLoading, isError, error, isSubmitting, onSubmit } = UpdateUserController(userId, scope);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen User</p>
          <h1 className="text-3xl font-semibold text-foreground">Edit User</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">Perbarui data dasar, profil singkat, dan status akun user dari halaman ini.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Update User</CardTitle>
            <CardDescription>{user ? `Mengubah data untuk ${user.name || user.email}` : 'Memuat data user...'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat data user untuk diedit.'}</div>
            ) : (
              <UserFormFields<UpdateUserInput>
                form={form}
                currentUserRole={currentUserRole}
                isLoading={isSubmitting}
                mode="update"
                onCancel={() => {
                  router.push(`/admin/users/${userId}?scope=${scope}`);
                }}
                onSubmit={(data) => {
                  onSubmit(data, (updatedUserId) => {
                    router.push(`/admin/users/${updatedUserId}?scope=${scope}`);
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
