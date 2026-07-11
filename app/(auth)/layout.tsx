import { redirect } from 'next/navigation';
import { auth } from '@/auth/auth.config';
import { getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user?.role) {
    const profile = await getProfileUser();

    if (profile?.status === 'BANNED') {
      redirect('/force-logout');
    }

    if (profile) {
      redirect(getRoleLandingPath(profile.insidiaRole, profile.mitraRoles));
    }
  }

  return <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#2F99B2] to-[#5DC9DD] p-4">{children}</div>;
}
