import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { getMitraName } from '../lib/mitra-dashboard.helper';
import type { MitraDashboardData } from '../types/mitra-dashboard.types';

type MitraDashboardHeroProps = Pick<MitraDashboardData, 'slug' | 'activeMitraRole' | 'roleCode' | 'isAcademicAdmin'>;

export function MitraDashboardHero({ slug, activeMitraRole, roleCode, isAcademicAdmin }: MitraDashboardHeroProps) {
  const mitraName = getMitraName(activeMitraRole.mitraName);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="warning" className="bg-amber-300 text-slate-950 hover:bg-amber-300">
            {roleCode}
          </Badge>
          <Badge variant="outline" className="border-border/60 bg-white/70 text-slate-800">
            {mitraName}
          </Badge>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard Mitra</CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-6 text-slate-600">Pantau kelas dan mapel yang terhubung dengan akunmu di mitra {mitraName}.</CardDescription>
        </div>
      </div>

      {isAcademicAdmin ? (
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="insidia">
            <Link href={`/mitra/admin/${slug}`}>Buka Panel Mitra</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/mitra/admin/${slug}/academic`}>Kelola Akademik</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
