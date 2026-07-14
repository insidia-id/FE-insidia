import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { LessonCreatePage } from '@/features/admin/lessons/pages/LessonCreatePage';

type LessonCreateRouteProps = {
  params: Promise<{
    slug: string;
    id: string;
    moduleId: string;
  }>;
};

export default async function LessonCreateRoute({ params }: LessonCreateRouteProps) {
  const { slug, id, moduleId } = await params;
  const profile = await getProfileUser();

  if (!profile) {
    redirect(`/mitra/${slug}/courses/${id}/module/${moduleId}`);
  }

  return <LessonCreatePage slug={slug} courseId={id} moduleId={moduleId} />;
}
