import { AppSidebar } from '@/components/common/AppSidebar';
import { getAdminMenuItems, getRoleLabel, getSidebarItemsByPermissions } from '@/features/admin/lib/SidebarMenuItems';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import type { UserRoleCode } from '@/features/admin/user/types/user.types';
function getUserFallback(userProfile: AuthProfileResponse | null) {
  const source = userProfile?.name?.trim() || userProfile?.email?.trim() || 'SA';
  return source.slice(0, 2).toUpperCase();
}
type AppSidebarAdminProps = {
  userProfile: AuthProfileResponse | null;
  activeRole?: UserRoleCode | null;
  activeMitraSlug?: string | null;
};
export function AppSidebarAdmin({ userProfile, activeRole = null, activeMitraSlug = null }: AppSidebarAdminProps) {
  return (
    <AppSidebar
      menuItems={getSidebarItemsByPermissions(getAdminMenuItems(activeRole, activeMitraSlug), userProfile?.permissions || [], activeRole)}
      user={{
        name: userProfile?.name || userProfile?.email || 'Super Admin',
        roleLabel: getRoleLabel(userProfile?.insidiaRole || 'USER'),
        avatar: userProfile?.image,
        fallback: getUserFallback(userProfile),
      }}
    />
  );
}
