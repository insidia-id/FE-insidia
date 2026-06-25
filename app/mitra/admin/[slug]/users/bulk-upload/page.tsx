import { BulkUploadUserPage } from '@/features/admin/user/pages/BulkUploadUserPage';
import { redirect } from 'next/navigation';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { PagePermission } from '@/app/middleware';
import { Permissions } from '@/lib/helper/permission.helper';

export default async function MitraAdminBulkUploadUserPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ role?: string; scope?: string }> }) {
  const profile = await getProfileUser();
  const { slug } = await params;
  const query = await searchParams;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/users/bulk-upload`);
  }

  PagePermission(profile, [Permissions.userPermissions.createUserMitra, Permissions.userPermissions.createUserInsidia]);

  return <BulkUploadUserPage currentProfile={toUserProfile(profile)} defaultRoleCode={query.role} defaultScope={query.scope} />;
}
