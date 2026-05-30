import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CoursesPage } from '@/features/admin/courses/components/CoursesPage';
import { toUserProfile } from '@/features/auth/auth.utils';

export default async function AdminCoursesPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses');
  }
  const userProfile = toUserProfile(profile);
  return <CoursesPage mitraSlug={null} initialScope="INSIDIA" canChangeScope currentProfile={userProfile} />;
}
