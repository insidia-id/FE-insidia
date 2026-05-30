import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CreateCoursePage } from '@/features/admin/courses/components/CreateCoursePage';
import { toUserProfile } from '@/features/auth/auth.utils';

type MitraCreateCoursePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MitraCreateCoursePage({ params }: MitraCreateCoursePageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/courses/create`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);

  if (!activeMitraRole) {
    redirect('/admin');
  }
  const userProfile = toUserProfile(profile);
  return <CreateCoursePage scope="MITRA" disableScopeField currentProfile={userProfile} />;
}
