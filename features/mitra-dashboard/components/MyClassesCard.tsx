import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getClassesDescription } from '../lib/mitra-dashboard.helper';
import { ClassItemCard } from './ClassItemCard';
import { EmptyState } from './EmptyState';
import type { MitraAcademicOverview, MitraDashboardRoleCode } from '../types/mitra-dashboard.types';

type MyClassesCardProps = {
  roleCode: MitraDashboardRoleCode;
  overview: MitraAcademicOverview;
};

export function MyClassesCard({ roleCode, overview }: MyClassesCardProps) {
  return (
    <Card className="border-border/70 bg-white/90 shadow-sm">
      <CardHeader>
        <CardTitle>Kelas Saya</CardTitle>
        <CardDescription>{getClassesDescription(roleCode)}</CardDescription>
      </CardHeader>
      <CardContent>
        {overview.shouldLoad ? (
          overview.error ? (
            <EmptyState message={overview.error} tone="error" />
          ) : overview.classes.length === 0 ? (
            <EmptyState message="Belum ada kelas yang terhubung dengan akunmu pada periode aktif." />
          ) : (
            <div className="space-y-3">
              {overview.classes.map((item) => (
                <ClassItemCard key={item.id} item={item} />
              ))}
            </div>
          )
        ) : (
          <EmptyState message="Role ini belum memiliki ringkasan akademik mandiri di dashboard." />
        )}
      </CardContent>
    </Card>
  );
}
