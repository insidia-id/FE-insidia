import { UsersPage } from '@/features/admin/user/pages/UsersPage';
import { USER_ROLE_PAGE_CONFIG } from '@/features/admin/user/config/user-page.config';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function MitraAdminGuardianUsersPage({ params }: { params: Promise<{ slug: string }> }) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/users/guardians`);
  }

  PagePermission(profile, [Permissions.userPermissions.view.MITRA]);

  return <UsersPage currentProfile={toUserProfile(profile)} pageConfig={USER_ROLE_PAGE_CONFIG.guardian} />;
}
