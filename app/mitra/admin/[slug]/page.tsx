import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthorizedMitraRole, getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';

interface MitraPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MitraPage({ params }: MitraPageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;
  const activeMitraRole = profile ? getAuthorizedMitraRole(profile.mitraRoles, slug) : null;
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0)_35%)] px-4 py-8">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-white/90 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-border/60 bg-white text-slate-800">
                {activeMitraRole.mitraName}
              </Badge>
              <Badge variant="secondary" className="bg-slate-900 text-white">
                {activeMitraRole.roleCode}
              </Badge>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-900">Dashboard Admin Mitra</h1>
              <p className="text-sm text-slate-600">Kelola data mitra, akses pengguna, dan struktur akademik dari satu tempat.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="insidia">
              <Link href={`/mitra/${slug}`}>Lihat Dashboard Mitra</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/mitra/admin/${slug}/users`}>Kelola User</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Ringkasan Akses</CardTitle>
              <CardDescription>Informasi user dan mitra aktif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <SummaryRow label="Slug Mitra" value={activeMitraRole.mitraSlug} />
              <SummaryRow label="Nama Mitra" value={activeMitraRole.mitraName} />
              <SummaryRow label="Role" value={activeMitraRole.roleCode} />
              <SummaryRow label="User" value={profile.name ?? profile.email} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-white/90 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Access</CardTitle>
              <CardDescription>Navigasi cepat ke modul utama.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <QuickLinkCard title="Akademik" description="Kelola tahun ajaran, semester, kelas, dan relasi rombel." href={`/mitra/admin/${slug}/academic`} />
              <QuickLinkCard title="Kursus" description="Manajemen kursus mitra dan detail konten." href={`/mitra/admin/${slug}/courses`} />
              <QuickLinkCard title="Akses Kontrol" description="Atur role dan permission untuk mitra." href={`/mitra/admin/${slug}/access-control`} />
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

function QuickLinkCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href={href}>Buka</Link>
      </Button>
    </div>
  );
}
