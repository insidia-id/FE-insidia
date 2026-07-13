import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { UpdateCoursePage } from '@/features/admin/courses/pages/UpdateCoursePage';
import { toUserProfile } from '@/features/auth/auth.utils';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';

type AdminEditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope: AccessScope;
  }>;
};

export default async function AdminEditCoursePage({ params, searchParams }: AdminEditCoursePageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses');
  }
  const { scope } = await searchParams;

  const userProfile = toUserProfile(profile);
  const { id } = await params;

  return <UpdateCoursePage courseId={id} currentProfile={userProfile} scope={scope} />;
}
