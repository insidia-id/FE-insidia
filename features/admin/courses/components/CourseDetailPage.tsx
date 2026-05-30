'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDeleteDialog } from '@/components/dialog/DialogDelete';
import { CourseDetailController } from '../controller/CourseDetailController';
import { CourseModulesSection } from './CourseModulesSection';
import { CourseMediaSection } from './CourseMediaSection';
import { formatCourseScope, formatCourseStatus, getCourseStatusVariant, getCoursesHref } from '../lib/course.helper';
import { formatDate, formatDateTime } from '@/features/admin/user/HelperUser';

type CourseDetailPageProps = {
  courseId: string;
  mitraSlug: string | null;
};

export function CourseDetailPage({ courseId, mitraSlug }: CourseDetailPageProps) {
  const router = useRouter();
  const { course, isLoading, isError, error, isDeleteOpen, isDeleting, onDelete, onDeleteOpenChange } = CourseDetailController(courseId, () => {
    router.push(getCoursesHref(mitraSlug));
  });
  const isMitraCourse = course?.scope === 'MITRA';

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">{isMitraCourse ? 'Manajemen Mapel Mitra' : 'Manajemen Course'}</p>
            <h1 className="text-3xl font-semibold text-foreground">{course?.title ?? (isMitraCourse ? 'Detail Mapel Mitra' : 'Detail Course')}</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{isMitraCourse ? 'Mapel mitra memakai entitas course scope MITRA. Detail ini menampilkan identitas mapel sekaligus struktur kontennya.' : 'Detail course dipisah dari modul dan media agar struktur file tetap rapi dan mudah di-maintain.'}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={getCoursesHref(mitraSlug)}>Kembali</Link>
            </Button>
            <Button asChild variant="insidia">
              <Link href={getCoursesHref(mitraSlug, `${courseId}/edit`)}>{isMitraCourse ? 'Edit Mapel' : 'Edit Course'}</Link>
            </Button>
            <Button variant="destructive" onClick={() => onDeleteOpenChange(true)}>
              {isMitraCourse ? 'Hapus Mapel' : 'Hapus Course'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="p-6">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error instanceof Error ? error.message : 'Gagal memuat detail course.'}</div>
            </CardContent>
          </Card>
        ) : course ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Utama</CardTitle>
                <CardDescription>{isMitraCourse ? 'Ringkasan identitas mapel, kurikulum, status akademik, dan atribut course yang melekat padanya.' : 'Ringkasan data dasar course beserta status publikasi dan kontennya.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getCourseStatusVariant(course.status)}>{formatCourseStatus(course.status)}</Badge>
                  <Badge variant="outline">{formatCourseScope(course.scope)}</Badge>
                  {isMitraCourse && <Badge variant={course.academicStatus === 'ACTIVE' ? 'success' : 'outline'}>{course.academicStatus}</Badge>}
                  <Badge variant="outline">{course.level}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <InfoItem label={isMitraCourse ? 'Kode Mapel' : 'Kode'} value={course.code ?? '-'} />
                  <InfoItem label="Kurikulum" value={course.curriculum?.name ?? '-'} />
                  <InfoItem label="Slug" value={course.slug} />
                  <InfoItem label="Harga" value={course.isFree ? 'Gratis' : `Rp${course.salePrice ?? course.price}`} />
                  <InfoItem label="Bahasa" value={course.language} />
                  <InfoItem label="Dibuat" value={formatDate(course.createdAt)} />
                  <InfoItem label="Dipublish" value={formatDateTime(course.publishedAt)} />
                  <InfoItem label="Modul" value={`${course._count.modules}`} />
                  <InfoItem label="Media" value={`${course._count.media}`} />
                  <InfoItem label="Lessons" value={`${course._count.lessons}`} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <LongTextItem label="Subtitle" value={course.subtitle} />
                  <LongTextItem label="Deskripsi" value={course.description} />
                  <LongTextItem label="Requirements" value={course.requirements.join('\n')} />
                  <LongTextItem label="Outcomes" value={course.outcomes.join('\n')} />
                  <LongTextItem label="Target User" value={course.targetUsers.join('\n')} />
                  <LongTextItem label="Alasan Penolakan" value={course.rejectReason} />
                </div>
              </CardContent>
            </Card>

            <CourseModulesSection courseId={courseId} />
            <CourseMediaSection courseId={courseId} />
          </>
        ) : null}
      </section>

      <ConfirmDeleteDialog
        open={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        description={`${isMitraCourse ? 'Mapel' : 'Course'} "${course?.title ?? ''}" akan diarsipkan dan dihapus dari daftar aktif.`}
        isLoading={isDeleting}
        onConfirm={onDelete}
      />
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || '-'}</p>
    </div>
  );
}

function LongTextItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-lg border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{value || '-'}</p>
    </div>
  );
}
