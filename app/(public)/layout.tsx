import { redirect } from 'next/navigation';
import Navbar from '@/components/common/navbar/Navbar';
import { getProfileUser } from '@/features/auth/api/api.server';

export const metadata = {
  title: 'Insidia - Marketplace untuk kebutuhan gaming kamu',
  description: 'Temukan berbagai produk gaming terbaik di Insidia, marketplace yang didedikasikan untuk para gamer. Dapatkan penawaran menarik dan layanan terbaik untuk kebutuhan gaming kamu.',
};
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let profile = null;

  try {
    profile = await getProfileUser();
  } catch {
    profile = null;
  }
  if (profile?.status === 'BANNED') {
    redirect('/force-logout');
  }
  console.log('profile', profile);
  return (
    <>
      <Navbar userProfile={profile} />
      {children}
    </>
  );
}
