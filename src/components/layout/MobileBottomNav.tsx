'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { useThemeMode } from '@/src/hooks/useThemeMode';
import { BOTTOM_NAV_ITEMS, PC_HEADER_ITEMS } from '@/src/utils/header.utils';
import {
  Avatar,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  useDisclosure,
} from '@heroui/react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from '../ui/theme/ThemeToggleButton';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: user } = useAuth();
  const { isDark } = useThemeMode();

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-divider flex justify-around items-center z-50 pb-safe">
        {BOTTOM_NAV_ITEMS.map((link) => {
          const isActive = pathname === link.href;

          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 flex-1"
            >
              {Icon && (
                <Icon
                  size={20}
                  className={isActive ? 'text-secondary' : 'text-default-500'}
                />
              )}
              <span
                className={`text-[10px] ${isActive ? 'text-secondary' : 'text-default-500'}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpen}
          className="flex flex-col items-center gap-1 flex-1"
        >
          <Menu
            size={20}
            className={isOpen ? 'text-secondary' : 'text-default-500'}
          />
          <span
            className={`text-[10px] ${isOpen ? 'text-secondary' : 'text-default-500'}`}
          >
            Más
          </span>
        </button>
      </nav>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        backdrop="blur"
        size="2xl"
        classNames={{
          base: 'rounded-t-2xl bg-background pb-safe max-h-[85vh] outline-none',
          closeButton:
            'top-6 right-6 z-50 p-2 active:bg-default-100 rounded-full outline-none',
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <DrawerBody className="px-4 py-12 pb-8 outline-none relative overflow-y-auto">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-default-300 rounded-full" />

              <div className="flex flex-col gap-1 items-stretch mt-4">
                {PC_HEADER_ITEMS.map((item) => {
                  const isProfile = item.href === '/profile';
                  const isActive = pathname === item.href;

                  if (isProfile && user) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`block w-full rounded-xl p-2 transition-colors ${isActive ? 'bg-secondary/10' : 'hover:bg-default-100'}`}
                      >
                        <div className="grid grid-cols-[44px_1fr] items-center gap-3">
                          <Avatar
                            color="secondary"
                            isBordered
                            name={user.email?.substring(0, 2).toUpperCase()}
                            size="md"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold truncate text-foreground">
                              {user.username ?? 'Usuario'}
                            </p>
                            <p className="text-xs text-default-500 truncate">
                              {user.email ?? '—'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`block w-full py-3 px-3 rounded-xl transition-colors text-sm font-medium ${isActive ? 'text-secondary bg-secondary/10' : 'text-foreground hover:bg-default-100'}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <Divider className="my-3" />

                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-default-500">
                    {isDark ? 'Modo Oscuro' : 'Modo Claro'}
                  </span>
                  <ThemeToggleButton />
                </div>
              </div>
            </DrawerBody>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
