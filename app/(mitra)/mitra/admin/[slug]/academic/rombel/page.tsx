import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { RombelPage } from '@/features/mitra-academic/rombel/pages/RombelPage';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';

type RombelRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RombelRoutePage({ params }: RombelRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/rombel`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);
  const { activeMitraId } = getActiveMitraContext(profile);
  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <RombelPage slug={slug} mitraId={activeMitraId} />;
}
