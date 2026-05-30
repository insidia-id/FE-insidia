import { UsersPage } from '@/features/admin/user/components/UsersPage';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';

export default async function AdminUsersPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }
  return <UsersPage currentProfile={profile} />;
}
