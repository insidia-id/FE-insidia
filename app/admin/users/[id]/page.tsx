import { UserDetailPage } from '@/features/admin/user/components/UserDetailPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { redirect } from 'next/navigation';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

type AdminUserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope?: string | string[];
  }>;
};

export default async function AdminUserDetailPage({ params, searchParams }: AdminUserDetailPageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }

  PagePermission(profile, [
    Permissions.userPermissions.viewUserInsidia,
    Permissions.userPermissions.viewUserMitra,
  ]);

  const { id } = await params;
  const query = await searchParams;
  const scope = (Array.isArray(query.scope) ? query.scope[0] : query.scope) === 'MITRA' ? 'MITRA' : 'INSIDIA';

  return <UserDetailPage userId={id} scope={scope} currentUserProfile={toUserProfile(profile!)} />;
}
