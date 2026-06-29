import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { ClassBatchPage } from '@/features/mitra-academic/class-batch/pages/ClassBatchPage';

type ClassBatchRoutePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ClassBatchRoutePage({ params }: ClassBatchRoutePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/academic/kelas-angkatan`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <ClassBatchPage slug={slug} />;
}
