import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CreateCoursePage } from '@/features/admin/courses/pages/CreateCoursePage';
import { toUserProfile } from '@/features/auth/auth.utils';

export default async function AdminCreateCoursePage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses/create');
  }
  const userProfile = toUserProfile(profile);
  return <CreateCoursePage currentProfile={userProfile} />;
}
