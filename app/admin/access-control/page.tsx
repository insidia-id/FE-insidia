import { PagePermission } from '@/app/middleware';
import { AccessControlPage } from '@/features/admin/access-control/components/AccessControlPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { redirect } from 'next/navigation';
import { Permissions } from '@/lib/helper/permission.helper';
export default async function AdminAccessControlPage() {
  const profile = await getProfileUser();
  if (!profile) {
    redirect('/login?callbackUrl=/admin/access-control');
  }
  const usersProfile = toUserProfile(profile);
  PagePermission(profile, [Permissions.permissionCodes.viewMitraPermissions]);
  return <AccessControlPage currentProfile={usersProfile} />;
}
