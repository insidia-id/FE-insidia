import { UpdateUserPage } from '@/features/admin/user/components/UpdateUserPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { redirect } from 'next/navigation';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

type AdminUserEditPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope?: string | string[];
  }>;
};

export default async function AdminUserEditPage({ params, searchParams }: AdminUserEditPageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }

  PagePermission(profile, [Permissions.userPermissions.updateUserInsidia, Permissions.userPermissions.updateUserMitra]);

  const userProfile = toUserProfile(profile);
  const { id } = await params;
  const query = await searchParams;
  const scope = (Array.isArray(query.scope) ? query.scope[0] : query.scope) === 'MITRA' ? 'MITRA' : 'INSIDIA';

  return <UpdateUserPage currentProfile={userProfile} userId={id} scope={scope} />;
}
