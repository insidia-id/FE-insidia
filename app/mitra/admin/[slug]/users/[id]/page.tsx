import { UserDetailPage } from '@/features/admin/user/components/UserDetailPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { forbidden } from 'next/navigation';
import { PagePermission } from '@/app/middleware';
import { toUserProfile } from '@/features/auth/auth.utils';
import { Permissions } from '@/lib/helper/permission.helper';

type MitraAdminUserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope?: string | string[];
  }>;
};

export default async function MitraAdminUserDetailPage({ params, searchParams }: MitraAdminUserDetailPageProps) {
  const profile = await getProfileUser();
  PagePermission(profile, [Permissions.userPermissions.viewUserMitra, Permissions.userPermissions.viewUserInsidia]);
  const { id } = await params;
  const query = await searchParams;
  const scope = (Array.isArray(query.scope) ? query.scope[0] : query.scope) === 'MITRA' ? 'MITRA' : 'INSIDIA';
  const userProfile = toUserProfile(profile!);
  return <UserDetailPage currentUserProfile={userProfile} userId={id} scope={scope} />;
}
