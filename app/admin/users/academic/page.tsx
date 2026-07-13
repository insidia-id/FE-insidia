import { UsersPage } from '@/features/admin/user/pages/UsersPage';
import { USER_ROLE_PAGE_CONFIG } from '@/features/admin/user/config/user-page.config';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function AdminAcademicUsersPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users/academic');
  }

  PagePermission(profile, [Permissions.userPermissions.view.MITRA, Permissions.userPermissions.view.INSIDIA]);

  return <UsersPage currentProfile={toUserProfile(profile)} pageConfig={USER_ROLE_PAGE_CONFIG.academic} />;
}
