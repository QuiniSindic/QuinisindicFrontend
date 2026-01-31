'use client';

import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/hooks/useThemeMode';
import { PC_HEADER_ITEMS } from '@/utils/header.utils';
import { Avatar, Modal, ModalBody, ModalContent } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggleButton } from '../ui/theme/ThemeToggleButton';

interface MobileDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ isOpen, onOpenChange }: MobileDrawerProps) {
  const pathname = usePathname();
  const { data: user } = useAuth();
  const { isDark } = useThemeMode();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      backdrop="blur"
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: '100%',
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      classNames={{
        base: 'rounded-t-2xl mb-0 sm:mb-0 w-full max-h-[85vh] h-auto bg-surface border border-border shadow-xl outline-none',
        wrapper: 'items-end z-[9999]',
        backdrop: 'z-[9998]',
        closeButton: `
          top-6 right-6 z-50 p-2 rounded-full outline-none
          text-muted hover:text-text active:bg-background
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          focus-visible:ring-offset-surface
        `,
      }}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="px-4 py-8 pb-safe relative flex-none text-text">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-border rounded-full" />

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
                      className={`block w-full rounded-xl p-2 transition-colors ${isActive ? 'bg-brand/10' : 'hover:bg-background'}`}
                    >
                      <div className="grid grid-cols-[44px_1fr] items-center gap-3">
                        <Avatar
                          isBordered
                          name={user.email?.substring(0, 2).toUpperCase()}
                          size="sm"
                          className="bg-surface text-text border-border"
                        />

                        <div className="min-w-0">
                          <p className="font-semibold truncate text-text">
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
                    className={`block w-full py-3 px-3 rounded-xl transition-colors text-sm font-medium
                      ${
                        isActive
                          ? 'text-brand bg-brand/10'
                          : 'text-text hover:bg-background'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="my-4 h-px w-full bg-border" />

              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-muted">
                  {isDark ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
                <ThemeToggleButton />
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
