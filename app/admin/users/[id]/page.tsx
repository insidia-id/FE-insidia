import { UserDetailPage } from '@/features/admin/user/components/UserDetailPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { forbidden } from 'next/navigation';
import { toUserProfile } from '@/features/auth/auth.utils';

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
  const role = profile ? profile.insidiaRole : null;

  if (!role || !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    forbidden();
  }

  const { id } = await params;
  const query = await searchParams;
  const scope = (Array.isArray(query.scope) ? query.scope[0] : query.scope) === 'MITRA' ? 'MITRA' : 'INSIDIA';

  return <UserDetailPage userId={id} scope={scope} currentUserProfile={toUserProfile(profile!)} />;
}
