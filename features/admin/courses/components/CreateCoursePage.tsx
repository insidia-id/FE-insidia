'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm } from './CourseForm';
import { CreateCourseController } from '../controller/CreateCourseController';
import { getCoursesHref } from '../lib/course.helper';
import type { CourseScope } from '../types/course.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

type CreateCoursePageProps = {
  scope: CourseScope;
  disableScopeField?: boolean;
  currentProfile: AuthProfileResponse;
};

export function CreateCoursePage({ scope, disableScopeField = false, currentProfile }: CreateCoursePageProps) {
  const router = useRouter();
  const mitraSlug = currentProfile.mitraRoles?.mitraSlug ?? null;
  const mitraId = currentProfile.mitraRoles?.mitraId ?? undefined;
  const { form, curriculumOptions, isSubmitting, onSubmit } = CreateCourseController(scope, mitraId);
  const isMitraCourse = scope === 'MITRA';

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraCourse ? 'Manajemen Mapel Mitra' : 'Manajemen Course'}</p>
          <h1 className="text-3xl font-semibold text-foreground">{isMitraCourse ? 'Tambah Mapel Mitra' : 'Tambah Course'}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{isMitraCourse ? 'Mapel mitra menggunakan entitas course scope MITRA yang terhubung ke kurikulum. Lengkapi identitas mapel dulu, lalu detail kontennya bisa dikelola dari halaman course.' : 'Isi informasi dasar course terlebih dahulu. Setelah course dibuat, modul dan media bisa dikelola dari halaman detail.'}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isMitraCourse ? 'Form Mapel Mitra' : 'Form Course'}</CardTitle>
            <CardDescription>{isMitraCourse ? 'Pastikan kurikulum, kode mapel, dan status akademiknya sesuai sebelum disimpan.' : 'Pastikan status, harga, dan scope course sudah sesuai sebelum disimpan.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm
              form={form}
              curriculumOptions={curriculumOptions}
              isSubmitting={isSubmitting}
              showScopeField
              disableScopeField={disableScopeField}
              onCancel={() => router.push(getCoursesHref(mitraSlug))}
              onSubmit={(data) => {
                onSubmit(data, (courseId) => {
                  router.push(getCoursesHref(mitraSlug, courseId));
                });
              }}
              submitLabel={isMitraCourse ? 'Simpan Mapel' : 'Simpan Course'}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
