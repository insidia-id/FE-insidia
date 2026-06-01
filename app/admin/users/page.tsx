import { UsersPage } from '@/features/admin/user/components/UsersPage';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function AdminUsersPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }

  PagePermission(profile, [
    Permissions.userPermissions.viewUserInsidia,
    Permissions.userPermissions.viewUserMitra,
  ]);

  return <UsersPage currentProfile={toUserProfile(profile)} />;
}
