import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { SubjectPage } from '@/features/mitra-academic/subject/pages/SubjectPage';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';

type SubjectRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SubjectRoutePage({ params }: SubjectRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/mapel`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);
  const { activeMitraId } = getActiveMitraContext(profile);
  if (!activeMitraRole) {
    redirect('/admin');
  }
  return <SubjectPage slug={slug} mitraId={activeMitraId ?? null} />;
}
