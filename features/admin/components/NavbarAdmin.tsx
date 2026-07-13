'use client';

import { NavbarUser } from '@/components/common/navbar/NavbarUser';
import { Bell, LogOut, Search, User, LayoutGrid } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { AuthProfileResponse } from '@/features/auth/types/auth.types';
import Link from 'next/link';

const navItems = [
  { href: '/profile', label: 'Profil Saya', icon: User },
  { href: '/notifications', label: 'Notifikasi', icon: Bell },
];

const navActions = [{ label: 'Keluar', icon: LogOut, action: 'logout' }];

const NavbarAdmin = ({ userProfile }: { userProfile: AuthProfileResponse | null }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50 w-full flex h-[70px]">
      
      <div className="hidden md:flex items-center justify-center w-[240px] lg:w-[260px]  shrink-0">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Image src="/logo.png" alt="Logo" width={100} height={100} className="h-auto w-[100px]" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-4">
          <div className="md:hidden flex items-center mr-2">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="h-auto w-[80px]" />
          </div>
          
          <SidebarTrigger className="h-9 w-9 border border-gray-300 bg-white rounded-md text-gray-600 hover:bg-gray-50 shrink-0" />
          
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            {/* <LayoutGrid className="h-[18px] w-[18px] text-gray-400" /> */}
            <span>Dashboard</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-gray-900 font-medium">Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className="hidden md:flex relative items-center transition-all">
            <Search className="absolute left-3 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Cari menu..." 
              className="pl-9 h-9 w-[200px] lg:w-[260px] rounded-full border-gray-300  focus-visible:ring-1 focus-visible:bg-white text-sm" 
            />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden border border-gray-200 rounded-full h-9 w-9 bg-gray-50" onClick={() => setIsSearchOpen((prev) => !prev)}>
            <Search className="h-4 w-4 text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="relative border border-gray-300 rounded-full h-9 w-9 bg-white hover:bg-gray-50 shrink-0">
            <Bell className="h-[18px] w-[18px] text-gray-600" />
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
          </Button>

          <NavbarUser userProfile={userProfile} navItems={navItems} navActions={navActions} />
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-200 p-4 md:hidden">
          <div className="relative w-full flex items-center bg-gray-50 rounded-full px-3 py-1 border border-gray-200">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <Input 
              type="search" 
              placeholder="Cari menu..." 
              className="w-full border-none bg-transparent shadow-none focus-visible:ring-0 px-0 h-8" 
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarAdmin;