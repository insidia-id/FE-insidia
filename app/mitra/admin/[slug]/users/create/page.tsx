import { CreateUserPage } from '@/features/admin/user/pages/CreateUserPage';

import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function MitraAdminCreateUserPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ role?: string; scope?: 'INSIDIA' | 'MITRA' }> }) {
  const profile = await getProfileUser();
  const { slug } = await params;
  const query = await searchParams;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/users/create`);
  }
  PagePermission(profile, [Permissions.userPermissions.createUserMitra, Permissions.userPermissions.createUserInsidia]);

  const userProfile = toUserProfile(profile);
  return <CreateUserPage currentProfile={userProfile} defaultRoleCode={query.role} defaultScope={query.scope} />;
}
