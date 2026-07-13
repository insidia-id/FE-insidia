import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { LessonEditorPage } from '@/features/admin/lessons/pages/LessonEditorPage';

type LessonEditorRouteProps = {
  params: Promise<{
    slug: string;
    id: string;
    moduleId: string;
    learningItemId: string;
    lessonId: string;
  }>;
};

export default async function LessonEditorRoute({ params }: LessonEditorRouteProps) {
  const { slug, id, moduleId, learningItemId, lessonId } = await params;
  const profile = await getProfileUser();

  if (!profile) {
    redirect(`/mitra/${slug}/courses/${id}/module/${moduleId}`);
  }

  const userProfile = toUserProfile(profile);

  return <LessonEditorPage slug={slug} courseId={id} moduleId={moduleId} learningItemId={learningItemId} lessonId={lessonId} currentProfile={userProfile} />;
}
