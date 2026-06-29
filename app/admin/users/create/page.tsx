import { CreateUserPage } from '@/features/admin/user/pages/CreateUserPage';

import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function AdminCreateUserPage({ searchParams }: { searchParams: Promise<{ role?: string; scope?: 'INSIDIA' | 'MITRA' }> }) {
  const profile = await getProfileUser();
  const query = await searchParams;

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }

  PagePermission(profile, [Permissions.userPermissions.create.INSIDIA, Permissions.userPermissions.create.MITRA]);

  const userProfile = toUserProfile(profile);

  return <CreateUserPage currentProfile={userProfile} defaultRoleCode={query.role} defaultScope={query.scope} />;
}
