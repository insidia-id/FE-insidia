import { UsersPage } from '@/features/admin/user/components/UsersPage';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function MitraAdminUsersPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/mitra/admin/users');
  }
  PagePermission(profile, [Permissions.userPermissions.viewUserMitra, Permissions.userPermissions.viewUserInsidia]);
  const userProfile = toUserProfile(profile);
  return <UsersPage currentProfile={userProfile} />;
}
