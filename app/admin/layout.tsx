import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarAdmin } from '@/features/admin/components/AppsidebarAdmin';
import NavbarAdmin from '@/features/admin/components/NavbarAdmin';
import { auth } from '@/auth/auth.config';
import { UserProfile } from '@/features/admin/user/types/user.types';
export const metadata = {
  title: 'Dashboard Admin - LmsInsidia',
  description: 'Dashboard admin untuk LmsInsidia.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userProfile: UserProfile | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
        email: session.user.email ?? null,
        role: session.user.role ?? null,
      }
    : null;
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebarAdmin userProfile={userProfile} />
      </div>
      <SidebarInset className="min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out">
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavbarAdmin userProfile={userProfile} />
        </div>
        <div className="min-w-0 pt-17">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
