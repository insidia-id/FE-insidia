import { redirect } from 'next/navigation';
import Navbar from '@/components/common/navbar/Navbar';
import { getProfileUser } from '@/features/auth/api/api.server';
import { getActiveMitraContext } from '@/features/admin/user/HelperUser';
import { toUserProfile } from '@/features/auth/auth.utils';

export const metadata = {
  title: 'Insidia - Marketplace untuk kebutuhan gaming kamu',
  description: 'Temukan berbagai produk gaming terbaik di Insidia, marketplace yang didedikasikan untuk para gamer. Dapatkan penawaran menarik dan layanan terbaik untuk kebutuhan gaming kamu.',
};
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let profile = null;

  try {
    profile = await getProfileUser();
    const userProfile = toUserProfile(profile!);
    console.log('User Profile:', userProfile);
    const { activeMitraRole, activeMitraSlug } = getActiveMitraContext(userProfile);
    console.log('Active Mitra Role:', activeMitraRole);
    console.log('Active Mitra Slug:', activeMitraSlug);
  } catch {
    profile = null;
  }
  if (profile?.status === 'BANNED') {
    redirect('/force-logout');
  }
  return (
    <>
      <Navbar userProfile={profile} />
      {children}
    </>
  );
}
