import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CourseDetailPage } from '@/features/admin/courses/pages/CourseDetailPage';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';
import { AccessScope } from '@/features/admin/access-control/types/access-control.types';

type AdminCourseDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope: AccessScope;
  }>;
};

export default async function AdminCourseDetailPage({ params, searchParams }: AdminCourseDetailPageProps) {
  const profile = await getProfileUser();
  const { scope } = await searchParams;

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses');
  }
  PagePermission(profile, [Permissions.coursePermissions.view.MITRA]);
  const { id } = await params;

  return <CourseDetailPage courseId={id} mitraSlug={null} scope={scope} />;
}
