import { UpdateUserPage } from '@/features/admin/user/components/UpdateUserPage';
import { auth } from '@/auth/auth.config';
import { forbidden } from 'next/navigation';

type AdminUserEditPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    scope?: string | string[];
  }>;
};

export default async function AdminUserEditPage({ params, searchParams }: AdminUserEditPageProps) {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || !['SUPER_ADMIN', 'ADMIN'].includes(role)) {
    forbidden();
  }

  const { id } = await params;
  const query = await searchParams;
  const scope = (Array.isArray(query.scope) ? query.scope[0] : query.scope) === 'MITRA' ? 'MITRA' : 'PLATFORM';

  return <UpdateUserPage currentUserRole={role} userId={id} scope={scope} />;
}
