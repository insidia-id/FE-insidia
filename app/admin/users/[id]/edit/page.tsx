import { UpdateUserPage } from '@/features/admin/user/components/UpdateUserPage';

type AdminUserEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const { id } = await params;

  return <UpdateUserPage userId={id} />;
}
