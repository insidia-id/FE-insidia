import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
// import { getUserProfile } from '@/features/account/profile/api/api';
import { AppSidebarAdmin } from '@/features/admin/components/AppsidebarAdmin';
import NavbarAdmin from '@/features/admin/components/NavbarAdmin';
// import NavbarSeller from '@/features/seller/components/NavbarSeller';
import { auth } from '@/auth/auth.config';
import { UserProfile } from '../(public)/layout';

export const metadata = {
  title: 'Dashboard Penjual - Ummang Food',
  description: 'Kelola produk, pesanan, dan profil penjual Anda di dashboard penjual Ummang Food.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  //   const userProfile = await getUserProfile();
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
        <AppSidebarAdmin />
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
