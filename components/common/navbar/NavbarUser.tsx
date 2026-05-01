'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import type { ComponentType } from 'react';
import { useLogout } from '@/features/auth/hooks/useauth';
import { is } from 'zod/v4/locales';
type NavbarItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick?: () => void;
  roles?: string[];
};
type NavbarAction = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  action: 'logout' | string;
};
type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  email?: string | null;
  role?: string | null;
};

export const NavbarUser = ({ userProfile, navItems, navActions }: { userProfile: UserProfile | null; navItems?: NavbarItem[]; navActions?: NavbarAction[] }) => {
  const displayName = userProfile?.name ?? 'User';
  const displayImage = userProfile?.image ?? '';

  if (!userProfile) {
    return (
      <Link href="/login">
        <Button variant="insidia" size={'lg'}>
          <LogIn className="h-4 w-4" />
          Masuk
        </Button>
      </Link>
    );
  }
  const { mutate: logout, isPending } = useLogout();
  const filteredNav = navItems?.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userProfile.role ?? '');
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" className="relative rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={displayImage} />
            <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="z-[99999] w-56 bg-white" sideOffset={8}>
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        {filteredNav?.map((item) =>
          item.onClick ? (
            <DropdownMenuItem key={item.href} onClick={item.onClick} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild key={item.href}>
              <Link href={item.href} className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ),
        )}
        {navActions?.map((action) => (
          <DropdownMenuItem
            key={action.label}
            disabled={isPending}
            onSelect={(event) => {
              if (action.action === 'logout') {
                event.preventDefault();
                logout();
              }
            }}
            className="flex items-center"
          >
            <action.icon className="mr-2 h-4 w-4" />
            {isPending && action.action === 'logout' ? 'Keluar...' : action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
