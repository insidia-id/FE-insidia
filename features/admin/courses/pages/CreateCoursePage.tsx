'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseForm } from '../form/CourseForm';
import { CreateCourseController } from '../controller/CreateCourseController';
import { getCoursesHref } from '../lib/course.helper';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { getActiveMitraContext, getAssignableScopeOptions, getUsersHref } from '@/features/admin/user/HelperUser';
import { useMitrasController } from '../../mitras/hooks/MitrasController';
import { useWatch } from 'react-hook-form';
import { AccessScope } from '../../access-control/types/access-control.types';

type CreateCoursePageProps = {
  currentProfile: AuthProfileResponse;
};

export function CreateCoursePage({ currentProfile }: CreateCoursePageProps) {
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
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <section className="mx-auto w-full px-4 space-y-6">
        <div className="space-y-2">
          {/* <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraCourse ? 'Manajemen Mapel Mitra' : 'Manajemen Course'}</p> */}
          <h1 className="text-3xl font-semibold text-foreground">{'Tambah Mata Pelajaran'}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {isMitraCourse
              ? 'Mata pelajaran mitra menggunakan entitas mata pelajaran scope MITRA yang terhubung ke kurikulum. Lengkapi identitas mata pelajaran dulu, lalu detail kontennya bisa dikelola dari halaman mata pelajaran.'
              : 'Isi informasi dasar mata pelajaran terlebih dahulu. Setelah mata pelajaran dibuat, modul dan media bisa dikelola dari halaman detail.'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isMitraCourse ? 'Form Mata Pelajaran Mitra' : 'Form Mata Pelajaran'}</CardTitle>
            <CardDescription>{isMitraCourse ? 'Pastikan kurikulum, kode Mata Pelajaran, dan status akademiknya sesuai sebelum disimpan.' : 'Pastikan status, harga, dan scope mata pelajaran sudah sesuai sebelum disimpan.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm
              form={form}
              curriculumOptions={curriculumOptions}
              isSubmitting={isSubmitting}
              onCancel={() => router.push(getUsersHref(activeMitraSlug, 'courses'))}
              onSubmit={(data) => {
                onSubmit(data, (courseId) => {
                  router.push(getUsersHref(activeMitraSlug, `courses/${courseId}?scope=${data.scope}`));
                });
              }}
              submitLabel={isMitraCourse ? 'Simpan Mapel' : 'Simpan Mata Pelajaran'}
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
