import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { AcademicYearPage } from '@/features/mitra-academic/academic-year/pages/AcademicYearPage';

type AcademicYearRoutePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AcademicYearRoutePage({ params }: AcademicYearRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/tahun-ajaran`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <AcademicYearPage slug={slug} />;
}
