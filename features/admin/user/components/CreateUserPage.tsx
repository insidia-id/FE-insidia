'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateUserController } from '../controller/CreateUserController';
import { UserFormFields } from '../form/UserForm';
import { CreateUserInput } from '../schema/user.schema';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getUsersHref } from '../HelperUser';
import { BulkUploadUserDialog } from './BulkUploadUserDialog';

type CreateUserPageProps = {
  currentProfile: AuthProfileResponse;
};

export function CreateUserPage({ currentProfile }: CreateUserPageProps) {
  const router = useRouter();
  const activeMitraRole = currentProfile.mitraRoles;
  const contextMitraId = activeMitraRole?.mitraId;
  const contextMitraSlug = activeMitraRole?.mitraSlug ?? null;
  const { form, isSubmitting, onSubmit } = CreateUserController(contextMitraId);
  const userRole = activeMitraRole?.roleCode ?? currentProfile?.insidiaRole;
  BulkUploadUserDialog;
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
              currentUserRole={userRole}
              isLoading={isSubmitting}
              mode="create"
              onCancel={() => {
                if (window.history.length > 1) {
                  router.back();
                  return;
                }

                router.push(getUsersHref(contextMitraSlug, 'users'));
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
