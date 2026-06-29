import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from './EmptyState';
import type { MitraAcademicOverview } from '../types/mitra-dashboard.types';

type MySubjectsCardProps = {
  overview: MitraAcademicOverview;
};

export function MySubjectsCard({ overview }: MySubjectsCardProps) {
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader>
        <CardTitle>Mapel Saya</CardTitle>
        <CardDescription>Daftar mapel yang terkait dengan akunmu pada periode aktif.</CardDescription>
      </CardHeader>
      <CardContent>
        {overview.shouldLoad ? (
          overview.error ? (
            <EmptyState message={overview.error} tone="error" />
          ) : overview.subjects.length === 0 ? (
            <EmptyState message="Belum ada mapel yang muncul untuk akunmu." />
          ) : (
            <ul className="space-y-2">
              {overview.subjects.map((subject) => (
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
  );
}
