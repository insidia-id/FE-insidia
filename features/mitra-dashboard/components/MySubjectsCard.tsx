import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from './EmptyState';
import type { MitraAcademicOverview } from '../types/mitra-dashboard.types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getUsersHref } from '@/features/admin/user/HelperUser';
import { UserRoleCode } from '@/features/admin/user/types/user.types';

type MySubjectsCardProps = {
  overview: MitraAcademicOverview;
  slug: string;
  userRole: UserRoleCode | null;
};

export function MySubjectsCard({ overview, slug, userRole }: MySubjectsCardProps) {
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 w-full">
          <CardTitle>Mapel Saya</CardTitle>
          <Link href={getUsersHref(slug, 'courses', userRole)} className="text-sm text-primary-600 hover:underline">
            <Button variant="insidia" size="sm">
              Lihat semua mapel
            </Button>
          </Link>
        </div>
        <CardDescription>Daftar mapel yang terkait dengan akunmu pada periode aktif.</CardDescription>
      </CardHeader>
      <CardContent>
        {overview.shouldLoad ? (
          overview.error ? (
            <EmptyState message={overview.error} tone="error" />
          ) : overview.courses.length === 0 ? (
            <EmptyState message="Belum ada mapel yang muncul untuk akunmu." />
          ) : (
            <ul className="space-y-2">
              {overview.courses.map((course) => (
                <li key={course.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">{course.title}</span>
                  <span className="text-xs text-slate-500">{course.slug || 'Tanpa slug'}</span>
                </li>
              ))}
            </ul>
          )
        ) : (
          <EmptyState message="Mapel pribadi belum tersedia untuk role ini." />
        )}
      </CardContent>
    </Card>
  );
}
