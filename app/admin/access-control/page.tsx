import { auth } from '@/auth/auth.config';
import { AccessControlPage } from '@/features/admin/access-control/components/AccessControlPage';
import { redirect } from 'next/navigation';
export default async function AdminAccessControlPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== 'SUPER_ADMIN') {
    redirect('/403');
  }

  return <AccessControlPage />;
}
