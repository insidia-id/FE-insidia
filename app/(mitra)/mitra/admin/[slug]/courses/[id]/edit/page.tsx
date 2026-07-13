import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { UpdateCoursePage } from '@/features/admin/courses/pages/UpdateCoursePage';
import { toUserProfile } from '@/features/auth/auth.utils';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';

type MitraEditCoursePageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
  searchParams: Promise<{
    scope: AccessScope;
  }>;
};

export default async function MitraEditCoursePage({ params, searchParams }: MitraEditCoursePageProps) {
  const profile = await getProfileUser();
  const { slug, id } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/courses/${id}/edit`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);
  const { scope } = await searchParams;

  const userProfile = toUserProfile(profile);
  if (!activeMitraRole) {
    redirect('/admin');
  }

  return <UpdateCoursePage courseId={id} currentProfile={userProfile} scope={scope} />;
}
