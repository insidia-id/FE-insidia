'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseForm } from '../form/CourseForm';
import { UpdateCourseController } from '../controller/UpdateCourseController';
import { getCoursesHref } from '../lib/course.helper';
import { AccessScope } from '../../access-control/types/access-control.types';
import { getActiveMitraContext, getAssignableScopeOptions } from '../../user/HelperUser';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { useMitrasController } from '../../mitras/hooks/MitrasController';

type UpdateCoursePageProps = {
  currentProfile: AuthProfileResponse;
  courseId: string;
  scope: AccessScope;
  disableScopeField?: boolean;
};

export function UpdateCoursePage({ currentProfile, courseId, scope }: UpdateCoursePageProps) {
  const router = useRouter();
  const { activeMitraId, activeMitraSlug, activeMitraRole, activeInsidiaRole } = getActiveMitraContext(currentProfile);
  const { form, course, curriculumOptions, isLoading, isError, error, isSubmitting, onSubmit } = UpdateCourseController({ activeMitraId, courseId, scope });

  const userRole = activeMitraRole ?? activeInsidiaRole;

  const getCurrentScope = getAssignableScopeOptions(activeMitraRole ?? activeInsidiaRole);

  const { mitraOptions, isLoading: isLoadingMitras, setMitraQuery } = useMitrasController({ enabled: userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' });

  const isMitraCourse = course?.scope === 'MITRA';

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraCourse ? 'Manajemen Mapel Mitra' : 'Manajemen Course'}</p>
          <h1 className="text-3xl font-semibold text-foreground">{isMitraCourse ? 'Edit Mapel Mitra' : 'Edit Course'}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {isMitraCourse
              ? 'Perbarui data mapel mitra yang memakai entitas course scope MITRA agar tetap sinkron dengan kurikulum akademik.'
              : 'Perbarui informasi dasar course tanpa mencampur pengelolaan modul dan media di file yang sama.'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isMitraCourse ? 'Form Mapel Mitra' : 'Form Course'}</CardTitle>
            <CardDescription>{course ? `Mengubah data ${course.title}` : 'Memuat data course...'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat detail course.'}</div>
            ) : (
              <CourseForm
                form={form}
                curriculumOptions={curriculumOptions}
                isSubmitting={isSubmitting}
                onCancel={() => router.push(getCoursesHref(activeMitraSlug))}
                onSubmit={(data) => {
                  onSubmit(data, () => {
                    router.push(getCoursesHref(activeMitraSlug, courseId));
                  });
                }}
                submitLabel={isMitraCourse ? 'Simpan Mapel' : 'Simpan Course'}
                mitraOptions={mitraOptions}
                isLoadingMitras={isLoadingMitras}
                userRole={userRole}
                setMitraQuery={setMitraQuery}
                getCurrentScope={getCurrentScope}
                scope={scope}
              />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
