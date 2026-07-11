import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { UpdateCoursePage } from '@/features/admin/courses/components/UpdateCoursePage';

type AdminEditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditCoursePage({ params }: AdminEditCoursePageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses');
  }

  const { id } = await params;

  return <UpdateCoursePage courseId={id} mitraSlug={null} />;
}
