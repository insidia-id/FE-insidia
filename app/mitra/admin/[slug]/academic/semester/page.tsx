import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { SemesterPage } from '@/features/mitra-academic/semester/pages/SemesterPage';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';
type SemesterPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MitraSemesterPage({ params }: SemesterPageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic`);
  }
  const { activeMitraId } = getActiveMitraContext(profile);
  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <SemesterPage slug={slug} mitraId={activeMitraId} />;
}
