import { ModuleDetailPage } from '@/features/admin/courses-module/pages/ModuleDetailPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';

type ModuleDetailRouteProps = {
  params: Promise<{
    slug: string;
    id: string;
    moduleId: string;
  }>;
};
export default async function ModuleDetailRoute({ params }: ModuleDetailRouteProps) {
  const { slug, id, moduleId } = await params;
  const profile = await getProfileUser();
  if (!profile) {
    return <div>Profile not found</div>;
  }
  const userProfile = toUserProfile(profile);
  return <ModuleDetailPage slug={slug} id={id} moduleId={moduleId} currentProfile={userProfile} />;
}
