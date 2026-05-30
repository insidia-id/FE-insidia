import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { MitraAcademicPage } from '@/features/mitra-academic/components/MitraAcademicPage';

type MitraAcademicRoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MitraAcademicRoutePage({ params }: MitraAcademicRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <MitraAcademicPage mitraId={activeMitraRole.mitraId} mitraName={activeMitraRole.mitraName} />;
}
