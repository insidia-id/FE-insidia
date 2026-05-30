import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { MitraDetailPage } from '@/features/admin/mitras/components/MitraDetailPage';

type AdminMitraDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminMitraDetailPage({ params }: AdminMitraDetailPageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/mitras');
  }

  const { id } = await params;

  return <MitraDetailPage mitraId={id} />;
}
