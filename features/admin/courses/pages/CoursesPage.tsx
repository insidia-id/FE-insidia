'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CoursesController } from '../controller/CoursesController';
import { getCoursesHref } from '../lib/course.helper';
import type { CourseScope } from '../types/course.types';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { CourseTable } from '../components/table/CourseTable';

type CoursesPageProps = {
  mitraSlug: string | null;
  initialScope: CourseScope;
  canChangeScope: boolean;
  currentProfile: AuthProfileResponse;
};

export function CoursesPage({ mitraSlug, initialScope, canChangeScope, currentProfile }: CoursesPageProps) {
  const { activeMitraId } = getActiveMitraContext(currentProfile);
  const { scope, courses, isLoading, isError, error, onScopeChange } = CoursesController({
    initialScope,
    mitraId: activeMitraId,
  });
  const isMitraView = scope === 'MITRA';
  const entityLabel = 'Mata Pelajaran';
  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraView ? 'Manajemen Mata Pelajaran Mitra' : 'Manajemen Mata Pelajaran'}</p>
            <h1 className="text-3xl font-semibold text-foreground">{`Daftar ${entityLabel}`}</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {isMitraView
                ? 'Mata pelajaran mitra memakai entitas mata pelajaran scope MITRA yang terhubung ke kurikulum. Di sini kita bisa melihat data mata pelajaran sekaligus atribut mata pelajaran yang menyertainya.'
                : 'Kelola daftar mata pelajaran, pantau status publikasinya, lalu buka detail untuk mengatur modul dan media.'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle>{`Semua ${entityLabel}`}</CardTitle>
              <CardDescription>{isLoading ? `Memuat data ${entityLabel.toLowerCase()}...` : `${courses.length} ${entityLabel.toLowerCase()} ditemukan`}</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat data mata pelajaran.'}</div>
            ) : (
              <CourseTable courses={courses} scope={scope} onScopeChange={onScopeChange} canChangeScope={canChangeScope} mitraSlug={mitraSlug} />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
