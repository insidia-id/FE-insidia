import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getClassesDescription } from '../lib/mitra-dashboard.helper';
import type { MitraAcademicOverview, MitraDashboardRoleCode } from '../types/mitra-dashboard.types';

type AcademicSummaryCardProps = {
  roleCode: MitraDashboardRoleCode;
  overview: MitraAcademicOverview;
};

export function AcademicSummaryCard({ roleCode, overview }: AcademicSummaryCardProps) {
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Ringkasan Akademik</CardTitle>
        <CardDescription>Jumlah kelas dan mata pelajaran yang terhubung.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 rounded-xl border border-border/60 p-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Kelas</p>
            <p className="text-2xl font-semibold text-slate-900">{overview.classes.length}</p>
            <p className="text-sm text-slate-600">{getClassesDescription(roleCode)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Mata Pelajaran</p>
            <p className="text-2xl font-semibold text-slate-900">{overview.courses.length}</p>
            <p className="text-sm text-slate-600">Daftar mata pelajaran aktif pada periode berjalan.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Ringkasan ini mengikuti role mitra aktif dan periode akademik berjalan.</p>
      </CardContent>
    </Card>
  );
}
