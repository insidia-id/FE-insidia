'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, Heart, Package, Store, Bell, LayoutDashboard, Settings, LogOut, BookOpen, Award, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavbarUser } from './NavbarUser';
import { TopNavAudience } from './AudienceSwitcher';
type UserProfile = {
  id: string;
  name: string | null;
  image: string | null;
  email?: string | null;
  role?: string | null;
};
const Navbar = ({ userProfile }: { userProfile: UserProfile | null }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: '/auth-redirect', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/bootcamps', label: 'Learning Path', icon: BookOpen },
    { href: '/courses', label: 'Courses', icon: Award },
    { href: '/about', label: 'Tentang', icon: Info },
  ];

  const navUser = [
    { href: '/profile', label: 'Profil Saya', icon: User },
    {
      href: '/auth-redirect',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'SELLER'],
    },
    { href: '/orders', label: 'Pesanan Saya', icon: Package },
    { href: '/address', label: 'Alamat Saya', icon: Store },
    { href: '/settings', label: 'Pengaturan', icon: Settings },
  ];
  const navActions = [{ label: 'Keluar', icon: LogOut, action: 'logout' }];
  return (
    <>
      <TopNavAudience />

      <header className="sticky top-0 z-50  w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-evenly lg:h-20">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col space-y-4">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href} className="flex items-center space-x-3 rounded-lg px-2 py-3 hover:bg-gray-100">
                        <Icon className="h-5 w-5" />
                        <span className="font-bold">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={100} height={100} />
            </Link>

            <div className="hidden items-center space-x-4 lg:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className="flex items-center hover:text-[#8458E4] transition-colors space-x-1 rounded-full px-3 py-2 text-sm hover:bg-gray-100">
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mx-4 hidden max-w-md flex-1 md:flex">
              <div className="relative w-full shadow-md border-2 border-[#6799D2] rounded-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#771FE6]" /> <Input placeholder="Cari sourses..." className="w-full rounded-full pl-10" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="md:hidden " onClick={() => setIsSearchOpen((prev) => !prev)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <NavbarUser userProfile={userProfile} navItems={navUser} navActions={navActions} />
            </div>
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pb-4 md:hidden">
                <Input placeholder="Cari..." />
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
