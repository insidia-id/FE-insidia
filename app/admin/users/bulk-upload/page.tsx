import { BulkUploadUserPage } from '@/features/admin/user/pages/BulkUploadUserPage';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function AdminBulkUploadUserPage({ searchParams }: { searchParams: Promise<{ role?: string; scope?: string }> }) {
  const profile = await getProfileUser();
  const params = await searchParams;

  if (!profile) {
    redirect('/login?callbackUrl=/admin/users/bulk-upload');
  }

  PagePermission(profile, [Permissions.userPermissions.createUserInsidia, Permissions.userPermissions.createUserMitra]);

  return <BulkUploadUserPage currentProfile={toUserProfile(profile)} defaultRoleCode={params.role} defaultScope={params.scope} />;
}
