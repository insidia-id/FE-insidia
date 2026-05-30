import { redirect } from 'next/navigation';
import Navbar from '@/components/common/navbar/Navbar';
import { getAuthorizedMitraRole, getRoleLandingPath } from '@/auth/redirect';
import { getProfileUser } from '@/features/auth/api/api.server';

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
      <Navbar userProfile={profile} />

      <main data-mitra={activeMitraRole.mitraSlug} className="min-h-screen">
        {children}
      </main>
    </>
  );
}
