import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { AcademicYearPage } from '@/features/mitra-academic/academic-year/pages/AcademicYearPage';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';

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
  const { activeMitraId } = getActiveMitraContext(profile);
  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <AcademicYearPage slug={slug} mitraId={activeMitraId} />;
}
