import { AppSidebar } from '@/components/common/AppSidebar';
import { getAdminMenuItems, getRoleLabel, getSidebarItemsByPermissions } from '@/features/admin/lib/SidebarMenuItems';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';

function getUserFallback(userProfile: AuthProfileResponse | null) {
  const source = userProfile?.name?.trim() || userProfile?.email?.trim() || 'SA';
  return source.slice(0, 2).toUpperCase();
}

export function AppSidebarAdmin({ userProfile, contextMitraSlug = null }: { userProfile: AuthProfileResponse | null; contextMitraSlug?: string | null }) {
  return (
    <AppSidebar
      menuItems={getSidebarItemsByPermissions(getAdminMenuItems(contextMitraSlug), userProfile?.permissions || [], userProfile?.insidiaRole)}
      user={{
        name: userProfile?.name || userProfile?.email || 'Super Admin',
        roleLabel: getRoleLabel(userProfile?.insidiaRole || 'USER'),
        avatar: userProfile?.image,
        fallback: getUserFallback(userProfile),
      }}
    />
  );
}
