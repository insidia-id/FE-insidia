'use client';
import { NavbarUser } from '@/components/common/navbar/NavbarUser';
import { Bell, LogOut, Search, User } from 'lucide-react';
import { useLogout } from '@/features/auth/hooks/useauth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/app/(public)/layout';
import Image from 'next/image';

const NavbarAdmin = ({ userProfile }: { userProfile: UserProfile | null }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { mutate: logout, isPending } = useLogout();

  const navItems = [
    { href: '/profile', label: 'Profil Saya', icon: User },
    { href: '/notifications', label: 'Notifikasi', icon: Bell },
  ];
  const navActions = [{ label: 'Keluar', icon: LogOut, action: 'logout' }];

  return (
    <nav className="bg-[#FAFAFA]/80 backdrop-blur-md border-b relative z-50 w-full border-[#E8D8DE] px-6">
      <div className="h-[70px] px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center  justify-center p-3">
            <div className="flex  w-full items-center overflow-hidden justify-center gap-2">
              <Image src="/logo.png" alt="Ummang Food Logo" width={100} height={100} className="object-contain" />
            </div>
          </div>

          <SidebarTrigger className="hover:bg-primary/10" />
        </div>

        <div className="flex items-center md:w-[500px] gap-4">
          <div className="hidden  md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Cari..." className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200 dark:border-gray-700 focus:border-primary bg-gray-50 dark:bg-gray-800" />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen((prev) => !prev)}>
            <Search className="h-5 w-5" />
          </Button>

          <NavbarUser userProfile={userProfile} navItems={navItems} navActions={navActions} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isSearchOpen && (
          <motion.div
            key="mobile-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-visible pb-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input type="search" placeholder="Cari... " className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200 dark:border-gray-700 focus:border-primary bg-gray-50 dark:bg-gray-800" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavbarAdmin;
