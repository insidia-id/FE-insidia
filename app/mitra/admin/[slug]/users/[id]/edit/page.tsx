import { PagePermission } from '@/app/middleware';
import { UpdateUserPage } from '@/features/admin/user/components/UpdateUserPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { Permissions } from '@/lib/helper/permission.helper';

type AdminUserEditPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope?: string | string[];
  }>;
};

export default async function MitraAdminUserEditPage({ params, searchParams }: AdminUserEditPageProps) {
  const profile = await getProfileUser();
  PagePermission(profile, [Permissions.userPermissions.viewUserMitra]);
  const userProfile = toUserProfile(profile!);
  const { id } = await params;
  const query = await searchParams;
  const scope = (Array.isArray(query.scope) ? query.scope[0] : query.scope) === 'MITRA' ? 'MITRA' : 'INSIDIA';

  return <UpdateUserPage currentProfile={userProfile} userId={id} scope={scope} />;
}
