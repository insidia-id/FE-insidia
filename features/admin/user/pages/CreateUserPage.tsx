'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateUserController } from '../hooks/CreateUserController';
import { UserFormFields } from '../form/UserForm';
import { CreateUserInput } from '../schema/user.schema';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { formatRole, getActiveMitraContext, getUsersHref, normalizeRoleQueryParam } from '../HelperUser';
import type { UserRoleCode, UserScope } from '../types/user.types';

type CreateUserPageProps = {
  currentProfile: AuthProfileResponse;
  defaultRoleCode?: string;
  defaultScope?: UserScope;
};

export function CreateUserPage({ currentProfile, defaultRoleCode, defaultScope }: CreateUserPageProps) {
  const router = useRouter();
  const normalizedRoleCode = normalizeRoleQueryParam(defaultRoleCode) as UserRoleCode | undefined;
  const { activeMitraId, activeMitraRole, activeMitraSlug, activeInsidiaRole, activeMitraName } = getActiveMitraContext(currentProfile);
  const { form, isSubmitting, onSubmit } = useCreateUserController({
    contextMitraId: activeMitraId ?? undefined,
    contextMitraName: activeMitraName ?? undefined,
    defaultRoleCode: normalizedRoleCode,
    activeMitraSlug: activeMitraSlug ?? undefined,
  });

  const title = normalizedRoleCode ? `Tambah ${formatRole(normalizedRoleCode)}` : 'Tambah User';
  const description = normalizedRoleCode ? `Buat akun ${formatRole(normalizedRoleCode).toLowerCase()} baru dan tentukan status awalnya dari halaman ini.` : 'Buat akun user baru dan tentukan role serta status awalnya dari halaman ini.';

  useEffect(() => {
    if (!defaultScope || form.getValues('scope') === defaultScope) {
      return;
    }

    form.setValue('scope', defaultScope);
  }, [defaultScope, form]);

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full px-4 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">Manajemen User</p>
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form User</CardTitle>
            <CardDescription>Isi data dasar user terlebih dahulu sebelum menyimpan.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserFormFields<CreateUserInput>
              form={form}
              currentUserRole={activeMitraRole ?? activeInsidiaRole}
              isLoading={isSubmitting}
              mode="create"
              onCancel={() => {
                if (window.history.length > 1) {
                  router.back();
                  return;
                }

                router.push(getUsersHref(activeMitraSlug, 'users'));
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
