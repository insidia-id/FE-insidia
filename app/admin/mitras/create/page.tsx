import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { CreateMitraPage } from '@/features/admin/mitras/components/CreateMitraPage';

export default async function AdminCreateMitraPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/mitras/create');
  }

  return <CreateMitraPage />;
}
