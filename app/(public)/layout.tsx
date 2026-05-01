import Navbar from '@/components/common/navbar/Navbar';
import { auth } from '@/auth/auth.config';

export const metadata = {
  title: 'Insidia - Marketplace untuk kebutuhan gaming kamu',
  description: 'Temukan berbagai produk gaming terbaik di Insidia, marketplace yang didedikasikan untuk para gamer. Dapatkan penawaran menarik dan layanan terbaik untuk kebutuhan gaming kamu.',
};

export type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  email?: string | null;
  role?: string | null;
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
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
    <>
      <Navbar userProfile={userProfile} />
      {children}
    </>
  );
}
