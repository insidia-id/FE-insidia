'use client';

import { BookOpen, Calendar, GraduationCap, Library, School, Users, UserSquare2, Users2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type NavigationCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  meta?: string;
  color: string;
};

type AcademicLandingPageProps = {
  slug: string;
  stats?: {
    academicYears?: number;
    semesters?: number;
    subjects?: number;
    classGroups?: number;
  };
};

export function AcademicLandingPage({ slug, stats }: AcademicLandingPageProps) {
  const baseHref = `/mitra/admin/${slug}/academic`;

  const navigationCards: NavigationCard[] = [
    {
      title: 'Tahun Ajaran',
      description: 'Kelola periode akademik utama yang menjadi dasar semester dan kelas.',
      href: `${baseHref}/tahun-ajaran`,
      icon: <Calendar className="size-5" />,
      meta: 'Prioritas',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Semester',
      description: 'Atur pembagian semester dalam setiap tahun ajaran aktif.',
      href: `${baseHref}/semester`,
      icon: <Calendar className="size-5" />,
      meta: 'Prioritas',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Kurikulum',
      description: 'Data kurikulum sebagai fondasi penyusunan Mata Pelajaran dan kelas.',
      href: `${baseHref}/kurikulum`,
      icon: <Library className="size-5" />,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Mata Pelajaran',
      description: 'Kelola Mata Pelajaran yang terhubung ke kurikulum mitra.',
      href: `courses`,
      icon: <BookOpen className="size-5" />,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'Kelas Angkatan',
      description: 'Buat dan kelola kelas angkatan sebagai pengelompokan utama siswa.',
      href: `${baseHref}/kelas-angkatan`,
      icon: <School className="size-5" />,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Rombongan Belajar',
      description: 'Kelompokkan siswa dalam rombel dengan wali kelas masing-masing.',
      href: `${baseHref}/rombel`,
      icon: <Users2 className="size-5" />,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Rombel - Mata Pelajaran',
      description: 'Hubungkan rombel dengan mata pelajaran dan tentukan guru pengajar.',
      href: `${baseHref}/rombel-mapel`,
      icon: <GraduationCap className="size-5" />,
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      title: 'Rombel - Murid',
      description: 'Kelola relasi murid dengan rombel pada periode tertentu.',
      href: `${baseHref}/rombel-murid`,
      icon: <UserSquare2 className="size-5" />,
      color: 'bg-orange-500/10 text-orange-600',
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_40%),radial-gradient(120%_80%_at_0%_0%,rgba(14,165,233,0.08),transparent)] px-4 py-8">
      <section className="mx-auto w-full max-w-7xl space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Mitra Academic</p>
            <h1 className="text-3xl font-semibold text-foreground">Manajemen Akademik</h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Kelola seluruh struktur akademik mitra mulai dari periode ajaran, kurikulum, kelas, hingga relasi rombel dan siswa. Pilih modul yang ingin dikelola dari menu navigasi di bawah.
            </p>
          </div>

          {stats && (
            <Card className="border-border/70 bg-white/90 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ringkasan Data</p>
                  <p className="text-sm text-muted-foreground">Data akademik yang sudah aktif di mitra ini.</p>
                </div>
                <div className="divide-y divide-border/60 rounded-lg border border-border/60">
                  <SummaryRow label="Tahun Ajaran" value={stats.academicYears ?? 0} />
                  <SummaryRow label="Semester" value={stats.semesters ?? 0} />
                  <SummaryRow label="Mata Pelajaran" value={stats.subjects ?? 0} />
                  <SummaryRow label="Rombel" value={stats.classGroups ?? 0} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <section className="rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Modul Akademik</h2>
            <p className="text-sm text-muted-foreground">Pilih modul yang ingin dikelola</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {navigationCards.map((card) => (
              <Link key={card.href} href={card.href}>
                <Card className="group h-full border-border/70 bg-white/90 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className={cn('flex size-10 items-center justify-center rounded-lg', card.color)}>{card.icon}</div>
                      {card.meta && <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{card.meta}</span>}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold group-hover:text-primary">{card.title}</CardTitle>
                      <CardDescription className="text-xs leading-5">{card.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold text-foreground">{value}</span>
    </div>
  );
}
