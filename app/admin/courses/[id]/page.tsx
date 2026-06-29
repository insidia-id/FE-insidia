import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CourseDetailPage } from '@/features/admin/courses/components/CourseDetailPage';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

type AdminCourseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCourseDetailPage({ params }: AdminCourseDetailPageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses');
  }
  PagePermission(profile, [Permissions.coursePermissions.view.MITRA]);
  const { id } = await params;

  return <CourseDetailPage courseId={id} mitraSlug={null} />;
}
