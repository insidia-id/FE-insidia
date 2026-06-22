import { redirect } from 'next/navigation';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';
import { toUserProfile } from '@/features/auth/auth.utils';

export default async function AuthRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const profile = await getProfileUser();

  if (profile?.status === 'BANNED') {
    redirect('/force-logout');
  }
  if (!profile) {
    redirect('/login');
  }
  const userProfile = toUserProfile(profile);
  const { activeMitraSlug } = getActiveMitraContext(userProfile);
  redirect(getRoleLandingPath(profile.insidiaRole, userProfile.mitraRoles, activeMitraSlug));
}
