import { UsersPage } from '@/features/admin/user/pages/UsersPage';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';
import { USER_ROLE_PAGE_CONFIG } from '@/features/admin/user/config/user-page.config';

export default async function MitraAdminUsersPage({ params }: { params: Promise<{ slug: string }> }) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/users`);
  }
  PagePermission(profile, [Permissions.userPermissions.viewUserMitra, Permissions.userPermissions.viewUserInsidia]);
  const userProfile = toUserProfile(profile);
  return <UsersPage currentProfile={userProfile} pageConfig={USER_ROLE_PAGE_CONFIG.all} />;
}
