import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CoursesPage } from '@/features/admin/courses/components/CoursesPage';
import { PagePermission } from '@/app/middleware';
import { toUserProfile } from '@/features/auth/auth.utils';
import { Permissions } from '@/lib/helper/permission.helper';

type MitraCoursesPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MitraCoursesPage({ params }: MitraCoursesPageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/courses`);
  }

  const activeMitraRole = getAuthorizedMitraRole(profile.mitraRoles, slug);
  PagePermission(profile, [Permissions.coursePermissionCodes.viewMitra]);
  if (!activeMitraRole) {
    redirect('/admin');
  }
  const userProfile = toUserProfile(profile);

  return <CoursesPage mitraSlug={slug} initialScope="MITRA" canChangeScope={false} currentProfile={userProfile} />;
}
