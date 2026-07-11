'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn, Check, Building2 } from 'lucide-react';
import type { ComponentType } from 'react';
import { useLogout } from '@/features/auth/hooks/useauth';
import { getNameInitials } from '@/features/admin/user/lib/user.mapper';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import { useSwitchUserMitraController } from '@/features/admin/user/hooks/useSwitchMitra';

type NavbarItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick?: () => void;
};

type NavbarAction = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  action: 'logout' | string;
};

type NavbarUserProps = {
  userProfile: AuthProfileResponse | null;
  navItems?: NavbarItem[];
  navActions?: NavbarAction[];
};

export const NavbarUser = ({ userProfile, navItems, navActions }: NavbarUserProps) => {
  const { mutate: logout, isPending } = useLogout();
  const Name = getNameInitials(userProfile?.insidiaRole ?? 'USER');
  const displayName = userProfile?.name ?? Name;
  const displayImage = userProfile?.image ?? '';
  const { selectedMitraId, onSelectMitra, isSubmitting } = useSwitchUserMitraController(userProfile?.activeMitraId);
  
  if (!userProfile) {
    return (
      <Link prefetch href="/login">
        <Button variant="insidia" size={'lg'}>
          <LogIn className="h-4 w-4 mr-2" />
          Masuk
        </Button>
      </Link>
    );
  }
  
  const mitraRoles = userProfile.mitraRoles ?? [];

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-auto flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-gray-100 focus-visible:ring-0">
            <Avatar className="h-9 w-9 border border-gray-200">
              <AvatarImage src={displayImage} />
              <AvatarFallback className="bg-primary/10 text-primary">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start justify-center text-left">
              <span className="text-[13px] font-semibold leading-tight text-gray-900">{displayName}</span>
              <span className="text-[11px] font-normal text-gray-500 mt-0.5">
                {userProfile.email ?? userProfile.insidiaRole ?? 'User'}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="z-[99999] w-64 bg-white" sideOffset={8}>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-semibold">{displayName}</span>
              <span className="text-xs font-normal text-gray-500">{userProfile.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {mitraRoles.length > 0 && (
            <>
              <DropdownMenuLabel className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {mitraRoles.length > 1 ? 'Beralih Mitra' : 'Mitra Aktif'}
              </DropdownMenuLabel>
              
              {mitraRoles.map((mitra) => {
                const isActive = selectedMitraId === mitra.mitraId;
                return (
                  <DropdownMenuItem 
                    key={mitra.mitraId} 
                    disabled={isSubmitting || isActive}
                    onSelect={() => {
                      if (!isActive) {
                        onSelectMitra(userProfile.id, mitra.mitraId);
                      }
                    }}
                    className="flex items-center justify-between cursor-pointer py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {mitra.mitraName}
                      </span>
                    </div>
                    {isActive && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
            </>
          )}

          {navItems?.map((item) =>
            item.onClick ? (
              <DropdownMenuItem key={item.href} onClick={item.onClick} className="flex items-center cursor-pointer py-2">
                <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                {item.label}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild key={item.href} className="cursor-pointer py-2">
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4 text-gray-500" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ),
          )}
          
          {navItems && navItems.length > 0 && <DropdownMenuSeparator />}
          
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
              className="flex items-center cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 py-2"
            >
              <action.icon className="mr-2 h-4 w-4" />
              {isPending && action.action === 'logout' ? 'Keluar...' : action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};