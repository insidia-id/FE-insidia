import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthorizedMitraRole, getRoleLandingPath } from '@/auth/redirect';
import { formatDate } from '@/features/admin/user/HelperUser';
import { getProfileUser } from '@/features/auth/api/api.server';
import { getMyAcademicClasses, getMyAcademicSubjects } from '@/features/mitra-academic/api/api.server';
import type { ClassGroupCourse, ClassGroupStudent, Subject } from '@/features/mitra-academic/types/mitra-academic.types';

interface MitraPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MitraPage({ params }: MitraPageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;
  const activeMitraRole = profile ? getAuthorizedMitraRole(profile.mitraRoles, slug) : null;
  const isAkademikMitraContext = profile?.mitraRoles?.roleCode === 'AKADEMIK';

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/${slug}`);
  }

  if (profile.status === 'BANNED') {
    redirect('/force-logout');
  }

  if (!activeMitraRole) {
    redirect(getRoleLandingPath(profile.insidiaRole, profile.mitraRoles));
  }

  if (activeMitraRole.mitraSlug !== slug) {
    redirect(`/mitra/${activeMitraRole.mitraSlug}`);
  }

  const roleCode = activeMitraRole.roleCode;
  const shouldLoadAcademicOverview = roleCode === 'GURU' || roleCode === 'MURID';

  let myClasses: Array<ClassGroupCourse | ClassGroupStudent> = [];
  let mySubjects: Subject[] = [];
  let academicError: string | null = null;

  if (shouldLoadAcademicOverview) {
    try {
      [myClasses, mySubjects] = await Promise.all([getMyAcademicClasses(activeMitraRole.mitraId), getMyAcademicSubjects(activeMitraRole.mitraId)]);
    } catch (error) {
      academicError = error instanceof Error ? error.message : 'Ringkasan akademik belum bisa dimuat saat ini.';
    }
  }

  const userLabel = profile.name ?? profile.email;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_32%),linear-gradient(135deg,rgba(249,115,22,0.08),rgba(14,165,233,0.08))] px-4 py-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="warning" className="bg-amber-300 text-slate-950 hover:bg-amber-300">
                {roleCode}
              </Badge>
              <Badge variant="outline" className="border-border/60 bg-white/70 text-slate-800">
                {activeMitraRole.mitraName}
              </Badge>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard Mitra</CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-6 text-slate-600">Pantau kelas dan mapel yang terhubung dengan akunmu di mitra {activeMitraRole.mitraName}.</CardDescription>
            </div>
          </div>
          {isAkademikMitraContext && (
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="insidia">
                <Link href={`/mitra/admin/${slug}`}>Buka Panel Mitra</Link>
              </Button>
              {shouldLoadAcademicOverview ? (
                <Button asChild variant="outline">
                  <Link href={`/mitra/admin/${slug}/academic`}>Kelola Akademik</Link>
                </Button>
              ) : null}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ringkasan Akses</CardTitle>
              <CardDescription>Identitas akun dan konteks mitra aktif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SummaryRow label="User" value={userLabel} />
              <SummaryRow label="Role Aktif" value={roleCode.replace('_', ' ')} />
              <SummaryRow label="Mitra" value={activeMitraRole.mitraName} />
              <SummaryRow label="Status Akun" value={profile.status} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ringkasan Akademik</CardTitle>
              <CardDescription>Jumlah kelas dan mapel yang terhubung.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 rounded-xl border border-border/60 p-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Kelas</p>
                  <p className="text-2xl font-semibold text-slate-900">{myClasses.length}</p>
                  <p className="text-sm text-slate-600">{getClassesDescription(roleCode)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mapel</p>
                  <p className="text-2xl font-semibold text-slate-900">{mySubjects.length}</p>
                  <p className="text-sm text-slate-600">Daftar mapel aktif pada periode berjalan.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Ringkasan ini mengikuti role mitra aktif dan periode akademik berjalan.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Kelas Saya</CardTitle>
              <CardDescription>{getClassesDescription(roleCode)}</CardDescription>
            </CardHeader>
            <CardContent>
              {shouldLoadAcademicOverview ? (
                academicError ? (
                  <EmptyState message={academicError} tone="error" />
                ) : myClasses.length === 0 ? (
                  <EmptyState message="Belum ada kelas yang terhubung dengan akunmu pada periode aktif." />
                ) : (
                  <div className="space-y-3">
                    {myClasses.map((item) => (
                      <ClassItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )
              ) : (
                <EmptyState message="Role ini belum memiliki ringkasan akademik mandiri di dashboard." />
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Mapel Saya</CardTitle>
              <CardDescription>Daftar mapel yang terkait dengan akunmu pada periode aktif.</CardDescription>
            </CardHeader>
            <CardContent>
              {shouldLoadAcademicOverview ? (
                academicError ? (
                  <EmptyState message={academicError} tone="error" />
                ) : mySubjects.length === 0 ? (
                  <EmptyState message="Belum ada mapel yang muncul untuk akunmu." />
                ) : (
                  <ul className="space-y-2">
                    {mySubjects.map((subject) => (
                      <li key={subject.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        <span className="font-medium text-slate-900">{subject.name}</span>
                        <span className="text-xs text-slate-500">{subject.code || 'Tanpa kode'}</span>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <EmptyState message="Mapel pribadi belum tersedia untuk role ini." />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-slate-50 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}

function EmptyState({ message, tone = 'default' }: { message: string; tone?: 'default' | 'error' }) {
  return <div className={['rounded-lg border p-4 text-sm leading-6', tone === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-600'].join(' ')}>{message}</div>;
}

function ClassItemCard({ item }: { item: ClassGroupCourse | ClassGroupStudent }) {
  if (isTeacherClass(item)) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">
              {item.classGroup.name} / {item.subject.name}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {item.classGroup.academicClass.name} / {item.academicYear.name} / {item.semester.name}
            </p>
          </div>
          <Badge variant={item.status === 'ACTIVE' ? 'success' : 'outline'}>{item.status}</Badge>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <span>Guru: {item.teacher.name ?? item.teacher.email}</span>
          <span>Diperbarui: {formatDate(item.updatedAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{item.classGroup.name}</p>
          <p className="mt-1 text-sm text-slate-600">
            {item.classGroup.academicClass.name} / {item.academicYear.name} / {item.semester.name}
          </p>
        </div>
        <Badge variant={item.status === 'ACTIVE' ? 'success' : 'outline'}>{item.status}</Badge>
      </div>
      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <span>Murid: {item.student.name ?? item.student.email}</span>
        <span>Diperbarui: {formatDate(item.updatedAt)}</span>
      </div>
    </div>
  );
}

function getClassesDescription(roleCode: string) {
  if (roleCode === 'GURU') {
    return 'Rombel dan mapel yang sedang kamu ampu pada periode aktif.';
  }

  if (roleCode === 'MURID') {
    return 'Rombel tempat kamu terdaftar pada periode aktif.';
  }

  return 'Ringkasan kelas berdasarkan role mitra aktif.';
}

function isTeacherClass(item: ClassGroupCourse | ClassGroupStudent): item is ClassGroupCourse {
  return 'teacherId' in item;
}
