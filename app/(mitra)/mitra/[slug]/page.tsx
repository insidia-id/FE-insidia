import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { MitraDashboardPage } from '@/features/mitra-dashboard/pages/MitraDashboardPage';
import { getMitraDashboardData } from '@/features/mitra-dashboard/services/mitra-dashboard.service';

interface MitraPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MitraPage({ params }: MitraPageProps) {
  const { slug } = await params;
  const data = await getMitraDashboardData(slug);
  const profile = await getProfileUser();

  if (!profile) {
    return <div>Loading...</div>;
  }

  const userProfile = toUserProfile(profile);
  return <MitraDashboardPage data={data} currentProfile={userProfile} />;
}
