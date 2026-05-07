'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, LogOut } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { AppSidebarProps } from '@/features/admin/types/Admin';
import { useLogout } from '@/features/auth/hooks/useauth';

function getHrefPath(href: string) {
  return href.split('?')[0];
}

export function AppSidebar({ menuItems, user, iconMap }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { mutate: logout, isPending } = useLogout();
  const isLoading = isPending;
  function isPathActive(pathname: string, href: string, exact = false) {
    const hrefPath = getHrefPath(href);

    if (exact) {
      return pathname === hrefPath;
    }

    return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
  }

  function isSameHref(href: string, pathname: string, searchParams: URLSearchParams) {
    const [hrefPath, hrefQueryString] = href.split('?');

    if (pathname !== hrefPath) return false;

    const hrefParams = new URLSearchParams(hrefQueryString);
    const hrefEntries = Array.from(hrefParams.entries());

    if (hrefEntries.length === 0) {
      return Array.from(searchParams.entries()).length === 0;
    }

    return hrefEntries.every(([key, value]) => searchParams.get(key) === value);
  }
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="mt-4 flex-1 overflow-y-auto md:mt-20">
        <div className="px-3 py-2">
          <TooltipProvider delayDuration={100}>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = iconMap[item.icon];
                const itemPath = getHrefPath(item.href);
                const isMenuItemActive = isPathActive(pathname, item.href, item.exact);

                if (item.submenu?.length) {
                  const activeSubmenuHref = item.submenu.find((subItem) => isSameHref(subItem.href, pathname, searchParams))?.href ?? '';

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link href={item.href} className={`flex items-center justify-center rounded-lg p-2 transition-colors ${isMenuItemActive ? 'bg-[#835DE3] text-white' : 'hover:bg-accent'}`}>
                            <Icon className="h-4 w-4 shrink-0" />
                          </Link>
                        </TooltipTrigger>

                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Collapsible key={item.href} defaultOpen={isMenuItemActive} className="space-y-1">
                      <CollapsibleTrigger asChild>
                        <button type="button" className={`flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors ${isMenuItemActive ? 'bg-[#835DE3] text-white' : 'hover:bg-accent'}`}>
                          <div className="flex min-w-0 items-center gap-3">
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate text-sm font-medium">{item.title}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.badge && (
                              <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                                {item.badge}
                              </Badge>
                            )}

                            <ChevronDown className="h-4 w-4 shrink-0" />
                          </div>
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="space-y-1">
                        <Tabs value={activeSubmenuHref} className="w-full">
                          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 bg-transparent p-0 pl-6">
                            {item.submenu.map((subItem) => {
                              const SubIcon = iconMap[subItem.icon];
                              const value = subItem.href;

                              return (
                                <TabsTrigger
                                  key={subItem.href}
                                  value={value}
                                  asChild
                                  className="h-auto justify-start rounded-lg p-2 text-sm font-normal data-[state=active]:bg-[#835DE3] data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                  <Link href={subItem.href}>
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                      <SubIcon className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate">{subItem.title}</span>
                                    </div>

                                    {subItem.badge && (
                                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                                        {subItem.badge}
                                      </Badge>
                                    )}
                                  </Link>
                                </TabsTrigger>
                              );
                            })}
                          </TabsList>
                        </Tabs>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link href={item.href} className={`flex items-center rounded-lg p-2 transition-colors ${isCollapsed ? 'justify-center' : 'justify-between'} ${isMenuItemActive ? 'bg-[#835DE3] text-white' : 'hover:bg-accent'}`}>
                        <div className="flex min-w-0 items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0" />

                          {!isCollapsed && <span className="truncate text-sm font-medium">{item.title}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </TooltipTrigger>

                    {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback>{user.fallback}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.roleLabel}</p>
            </div>

            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => logout()} disabled={isLoading}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => logout()} disabled={isLoading}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
