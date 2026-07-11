import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { MitraDashboardPage } from '@/features/mitra-dashboard/pages/MitraDashboardPage';
import { getMitraDashboardData } from '@/features/mitra-dashboard/services/mitra-dashboard.service';
    import { redirect } from 'next/navigation';

interface MitraPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MitraPage({ params }: MitraPageProps) {
  const { slug } = await params;
  const data = await getMitraDashboardData(slug);
  const profile = await getProfileUser();

    if (!profile) redirect(`/login?callbackUrl=/mitra/${slug}`);
    
    const userProfile = toUserProfile(profile);

  return <MitraDashboardPage data={data} userProfile={userProfile} />;
}
