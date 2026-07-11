import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { MitrasPage } from '@/features/admin/mitras/pages/MitrasPage';
import { toUserProfile } from '@/features/auth/auth.utils';

export default async function AdminMitrasPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/mitras');
  }
  const userProfile = toUserProfile(profile);
  return <MitrasPage currentProfile={userProfile} />;
}
