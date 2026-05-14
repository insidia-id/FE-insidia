import { AppSidebar } from '@/components/common/AppSidebar';
import type { UserProfile } from '@/features/admin/user/types/user.types';
import { getRoleLabel, getSidebarItemsByRole } from '@/features/admin/lib/SidebarMenuItems';

function getUserFallback(userProfile: UserProfile | null) {
  const source = userProfile?.name?.trim() || userProfile?.email?.trim() || 'SA';
  return source.slice(0, 2).toUpperCase();
}

export function AppSidebarAdmin({ userProfile }: { userProfile: UserProfile | null }) {
  return (
    <AppSidebar
      menuItems={getSidebarItemsByRole(userProfile?.role)}
      user={{
        name: userProfile?.name || userProfile?.email || 'Super Admin',
        roleLabel: getRoleLabel(userProfile?.role),
        avatar: userProfile?.image,
        fallback: getUserFallback(userProfile),
      }}
    />
  );
}
