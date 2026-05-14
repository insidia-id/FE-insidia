import { CreateUserPage } from '@/features/admin/user/components/CreateUserPage';

import { forbidden } from 'next/navigation';
import { auth } from '@/auth/auth.config';

export default async function AdminCreateUserPage() {
  const session = await auth();

  const role = session?.user?.role;
  if (!role || !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    forbidden();
  }

  return <CreateUserPage currentUserRole={role} />;
}
