import { UserDetailPage } from '@/features/admin/user/components/UserDetailPage';

type AdminUserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const { id } = await params;

  return <UserDetailPage userId={id} />;
}
