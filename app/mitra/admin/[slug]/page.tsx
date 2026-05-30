import { redirect } from 'next/navigation';
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">Dashboard Mitra</h1>

      <p className="mt-2 text-muted-foreground">Halaman mitra: {activeMitraRole.mitraSlug}</p>
      <p className="mt-2 text-muted-foreground">Nama Mitra: {activeMitraRole.mitraName}</p>
      <p className="mt-2 text-muted-foreground">Role: {activeMitraRole.roleCode}</p>
      <p className="mt-2 text-muted-foreground">User: {profile.name ?? profile.email}</p>
    </div>
  );
}
