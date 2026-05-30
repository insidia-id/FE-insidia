import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { UpdateMitraPage } from '@/features/admin/mitras/components/UpdateMitraPage';

type AdminUpdateMitraPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminUpdateMitraPage({ params }: AdminUpdateMitraPageProps) {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/mitras');
  }

  const { id } = await params;

  return <UpdateMitraPage mitraId={id} />;
}
