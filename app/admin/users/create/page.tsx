import { CreateUserPage } from '@/features/admin/user/components/CreateUserPage';

import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';

export default async function AdminCreateUserPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users');
  }
  const userProfile = toUserProfile(profile);

  return <CreateUserPage currentProfile={userProfile} />;
}
