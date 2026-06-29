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

  return <MitraDashboardPage data={data} />;
}
