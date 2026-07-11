import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CurriculumPage } from '@/features/mitra-academic/curriculum/pages/CurriculumPage';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';

type CurriculumRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CurriculumRoutePage({ params }: CurriculumRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/kurikulum`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);
  const { activeMitraId } = getActiveMitraContext(profile);
  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <CurriculumPage slug={slug} mitraId={activeMitraId} />;
}
