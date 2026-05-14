import { UsersPage } from '@/features/admin/user/components/UsersPage';
import { auth } from '@/auth/auth.config';
import { forbidden } from 'next/navigation';

export default async function AdminUsersPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    forbidden();
  }

  return <UsersPage currentUserRole={role} />;
}
