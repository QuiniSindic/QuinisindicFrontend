'use client';

import { ThemeSwitcher } from '@/src/components/ui/theme/ThemeSwitcher';
import { useAuth } from '@/src/hooks/useAuth';
import { MENU_ITEMS } from '@/src/utils/header.utils';
import { Avatar, Divider, NavbarMenu, NavbarMenuItem } from '@heroui/react';
import Link from 'next/link';

interface MobileNavbarMenuProps {
  onNavigate: (path: string) => void;
}

export const MobileNavbarMenu = ({ onNavigate }: MobileNavbarMenuProps) => {
  const { data: user } = useAuth();

  return (
    <NavbarMenu className="flex flex-col gap-1 items-stretch px-2 py-2">
      {MENU_ITEMS.map((item) => {
        const isProfile = item.href === '/profile';

        // Si es el item de perfil, mostramos avatar + username + email
        if (isProfile && user) {
          return (
            <NavbarMenuItem key={item.href} className="w-full">
              <Link
                href={item.href}
                onClick={() => onNavigate(item.href)}
                className="
                  block w-full text-foreground rounded-xl
                  hover:bg-white/10 transition
                  px-2 py-2
                "
              >
                <div className="grid grid-cols-[44px_1fr] items-center gap-3">
                  <Avatar
                    color="secondary"
                    name={user.email?.substring(0, 2).toUpperCase()}
                    classNames={{
                      base: 'text-white bg-secondary flex items-center justify-center',
                      icon: 'text-white',
                    }}
                    showFallback
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {user.username ?? 'Usuario'}
                    </p>
                    <p className="text-xs opacity-70 truncate">
                      {user.email ?? '—'}
                    </p>
                  </div>
                </div>
              </Link>
            </NavbarMenuItem>
          );
        }

        // normal
        return (
          <NavbarMenuItem key={item.href} className="w-full">
            <Link
              href={item.href}
              onClick={() => onNavigate(item.href)}
              className="
                block w-full py-2 px-2 rounded-xl
                text-foreground hover:bg-white/10 transition
              "
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        );
      })}

      <Divider className="my-2 w-full" />

      <NavbarMenuItem className="w-full flex items-center justify-between px-2">
        <span className="text-sm text-foreground/70">Tema</span>
        <ThemeSwitcher />
      </NavbarMenuItem>
    </NavbarMenu>
  );
};

export default MobileNavbarMenu;
