'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm } from '../form/CourseForm';
import { CreateCourseController } from '../controller/CreateCourseController';
import { getCoursesHref } from '../lib/course.helper';
import type { CourseScope } from '../types/course.types';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getActiveMitraContext, getAssignableScopeOptions } from '@/features/admin/user/HelperUser';
import { useMitrasController } from '../../mitras/hooks/MitrasController';
import { useWatch } from 'react-hook-form';

type CreateCoursePageProps = {
  disableScopeField?: boolean;
  currentProfile: AuthProfileResponse;
};

export function CreateCoursePage({ disableScopeField = false, currentProfile }: CreateCoursePageProps) {
  const router = useRouter();
  const { activeMitraId, activeMitraSlug, activeMitraRole, activeInsidiaRole } = getActiveMitraContext(currentProfile);

  const { form, curriculumOptions, isSubmitting, onSubmit } = CreateCourseController(activeMitraId ?? undefined);
  const userRole = activeMitraRole ?? activeInsidiaRole;
  const selectedScope = useWatch({
    control: form.control,
    name: 'scope',
  });

  const getCurrentScope = getAssignableScopeOptions(activeMitraRole ?? activeInsidiaRole);
  const { mitraOptions, isLoading: isLoadingMitras, setMitraQuery } = useMitrasController({ enabled: userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' });

  const isMitraCourse = selectedScope === 'MITRA';
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraCourse ? 'Manajemen Mapel Mitra' : 'Manajemen Course'}</p>
          <h1 className="text-3xl font-semibold text-foreground">{isMitraCourse ? 'Tambah Mapel Mitra' : 'Tambah Course'}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {isMitraCourse
              ? 'Mapel mitra menggunakan entitas course scope MITRA yang terhubung ke kurikulum. Lengkapi identitas mapel dulu, lalu detail kontennya bisa dikelola dari halaman course.'
              : 'Isi informasi dasar course terlebih dahulu. Setelah course dibuat, modul dan media bisa dikelola dari halaman detail.'}
          </p>
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
              disableScopeField={disableScopeField}
              onCancel={() => router.push(getCoursesHref(activeMitraSlug))}
              onSubmit={(data) => {
                onSubmit(data, (courseId) => {
                  router.push(getCoursesHref(activeMitraSlug, courseId));
                });
              }}
              submitLabel={isMitraCourse ? 'Simpan Mapel' : 'Simpan Course'}
              mitraOptions={mitraOptions}
              isLoadingMitras={isLoadingMitras}
              userRole={userRole}
              setMitraQuery={setMitraQuery}
              getCurrentScope={getCurrentScope}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
