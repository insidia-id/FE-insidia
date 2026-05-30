import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { MitrasPage } from '@/features/admin/mitras/components/MitrasPage';

export default async function AdminMitrasPage() {
  const profile = await getProfileUser();

  if (!profile) {
    redirect('/login?callbackUrl=/admin/mitras');
  }

  return <MitrasPage />;
}
