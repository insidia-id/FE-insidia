import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { RombelStudentPage } from '@/features/mitra-academic/rombel-student/pages/RombelStudentPage';

type RombelStudentRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RombelStudentRoutePage({ params }: RombelStudentRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/rombel-murid`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <RombelStudentPage slug={slug} />;
}
