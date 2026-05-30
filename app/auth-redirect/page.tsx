import { redirect } from 'next/navigation';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';

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

  redirect(getRoleLandingPath(profile.insidiaRole, profile.mitraRoles));
}
