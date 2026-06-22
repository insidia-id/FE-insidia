import { getAuthorizedMitraRole } from '@/auth/redirect';
import { PagePermission } from '@/app/middleware';
import { AccessControlPage } from '@/features/admin/access-control/components/AccessControlPage';
import { getProfileUser } from '@/features/auth/api/api.server';
import { toUserProfile } from '@/features/auth/auth.utils';
import { redirect } from 'next/navigation';
import { Permissions } from '@/lib/helper/permission.helper';

type MitraAdminAccessControlPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MitraAdminAccessControlPage({ params }: MitraAdminAccessControlPageProps) {
  const profile = await getProfileUser();
  const { slug } = await params;

  if (!profile) {
    redirect(`/login?callbackUrl=/mitra/admin/${slug}/access-control`);
  }

  const userProfile = toUserProfile(profile);
  const authorizedMitraRole = getAuthorizedMitraRole(userProfile.mitraRoles, slug);

  if (!authorizedMitraRole) {
    redirect('/admin');
  }

  PagePermission(profile, [Permissions.permissionCodes.manageMitraPermissions]);
  return <AccessControlPage currentProfile={userProfile} />;
}
