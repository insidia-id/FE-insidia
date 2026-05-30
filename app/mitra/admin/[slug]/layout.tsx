import { redirect } from 'next/navigation';
import { getAuthorizedMitraRole, getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';
import { AuthSessionProvider } from '@/auth/AuthSessionProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebarAdmin } from '@/features/admin/components/AppsidebarAdmin';
import NavbarAdmin from '@/features/admin/components/NavbarAdmin';

export const metadata = {
  title: 'Insidia - Marketplace untuk kebutuhan gaming kamu',
  description: 'Temukan berbagai produk gaming terbaik di Insidia, marketplace yang didedikasikan untuk para gamer. Dapatkan penawaran menarik dan layanan terbaik untuk kebutuhan gaming kamu.',
};
export default async function MitraLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const profile = await getProfileUser();
  const { slug } = await params;
  const activeMitraRole = profile ? getAuthorizedMitraRole(profile.mitraRoles, slug) : null;
  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/${slug}`);
  }

  if (profile.status === 'BANNED') {
    redirect('/force-logout');
  }

  if (!activeMitraRole) {
    redirect(getRoleLandingPath(profile.insidiaRole, profile.mitraRoles));
  }

  if (activeMitraRole.mitraSlug !== slug) {
    redirect(`/mitra/${activeMitraRole.mitraSlug}`);
  }

  return (
    <>
      <AuthSessionProvider>
        <SidebarProvider>
          <div className="flex">
            <AppSidebarAdmin userProfile={profile} contextMitraSlug={slug} />
          </div>
          <SidebarInset className="min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out">
            <div className="fixed top-0 left-0 right-0 z-50">
              <NavbarAdmin userProfile={profile} />
            </div>
            <div className="min-w-0 pt-17">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </AuthSessionProvider>
    </>
  );
}
