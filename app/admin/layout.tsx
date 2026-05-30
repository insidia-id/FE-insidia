import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AuthSessionProvider } from '@/auth/AuthSessionProvider';
import { AppSidebarAdmin } from '@/features/admin/components/AppsidebarAdmin';
import NavbarAdmin from '@/features/admin/components/NavbarAdmin';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { getRoleLandingPath } from '@/auth/redirect';

export const metadata = {
  title: 'Dashboard Admin - LmsInsidia',
  description: 'Dashboard admin untuk LmsInsidia.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userProfile = await getProfileUser();
  if (!userProfile) {
    redirect('/login?callbackUrl=/admin');
  }
  if (userProfile.status === 'BANNED') {
    redirect('/force-logout');
  }

  const landingPath = getRoleLandingPath(userProfile.insidiaRole, userProfile.mitraRoles);
  if (landingPath !== '/admin') {
    redirect(landingPath);
  }

  const profile = toUserProfile(userProfile);

  return (
    <AuthSessionProvider>
      <SidebarProvider>
        <div className="flex">
          <AppSidebarAdmin userProfile={profile} contextMitraSlug={null} />
        </div>
        <SidebarInset className="min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out">
          <div className="fixed top-0 left-0 right-0 z-50">
            <NavbarAdmin userProfile={profile} />
          </div>
          <div className="min-w-0 pt-17">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthSessionProvider>
  );
}
