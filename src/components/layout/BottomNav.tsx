'use client';

import { BOTTOM_NAV_ITEMS } from '@/src/utils/header.utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';

interface BottomNavProps {
  isOpen: boolean;
  pathname: string;
  onOpen: () => void;
}

export const BottomNav = ({ isOpen, onOpen, pathname }: BottomNavProps) => {
  const activeCls = 'text-brand';
  const inactiveCls = 'text-muted';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-lg border-t border-border flex justify-around items-center z-50 pb-safe pointer-events-auto">
      {BOTTOM_NAV_ITEMS.map((link) => {
        const isActive = pathname === link.href;

        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-1 flex-1 active:opacity-70"
          >
            {Icon && (
              <Icon size={20} className={isActive ? activeCls : inactiveCls} />
            )}
            <span
              className={`text-[10px] ${isActive ? activeCls : inactiveCls}`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-col items-center gap-1 flex-1 active:opacity-70"
      >
        <Menu size={20} className={isOpen ? activeCls : inactiveCls} />
        <span className={`text-[10px] ${isOpen ? activeCls : inactiveCls}`}>
          Más
        </span>
      </button>
    </nav>
  );
};
