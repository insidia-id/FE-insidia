import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { AcademicLandingPage } from '@/features/mitra-academic/layout/AcademicLandingPage';

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

  return <AcademicLandingPage slug={slug} />;
}
