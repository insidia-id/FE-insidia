import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { RombelSubjectPage } from '@/features/mitra-academic/rombel-subject/pages/RombelSubjectPage';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';

type RombelSubjectRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RombelSubjectRoutePage({ params }: RombelSubjectRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/rombel-mapel`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);
  const { activeMitraId } = getActiveMitraContext(profile);
  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <RombelSubjectPage slug={slug} mitraId={activeMitraId} />;
}
