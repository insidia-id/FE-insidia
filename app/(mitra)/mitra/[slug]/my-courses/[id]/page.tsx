import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { MyCoursesDetailPage } from '@/features/my-courses/pages/MyCoursesDetailPage';

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const profile = await getProfileUser();
  if (!profile) {
    return <div>Profile not found</div>;
  }
  const userProfile = toUserProfile(profile);
  return <MyCoursesDetailPage id={id} currentProfile={userProfile} />;
}
