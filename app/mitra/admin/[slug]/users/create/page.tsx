import { CreateUserPage } from '@/features/admin/user/components/CreateUserPage';

import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function MitraAdminCreateUserPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }
  PagePermission(profile, [Permissions.userPermissions.createUserMitra, Permissions.userPermissions.createUserInsidia]);

  const userProfile = toUserProfile(profile);
  return <CreateUserPage currentProfile={userProfile} />;
}
