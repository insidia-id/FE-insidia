import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { LessonEditorPage } from '@/features/admin/lessons/pages/LessonEditorPage';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

type LessonEditorRouteProps = {
  params: Promise<{
    id: string;
    moduleId: string;
    learningItemId: string;
    lessonId: string;
  }>;
};

export default async function LessonEditorRoute({ params }: LessonEditorRouteProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/courses');
  }

  PagePermission(profile, [Permissions.coursePermissions.view.MITRA]);

  const { id: courseId, moduleId, learningItemId, lessonId } = await params;

  return <LessonEditorPage courseId={courseId} moduleId={moduleId} learningItemId={learningItemId} lessonId={lessonId} />;
}
