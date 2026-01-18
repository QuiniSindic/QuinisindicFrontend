'use client';

import { MENU_ITEMS } from '@/src/utils/header.utils';
import { NavbarContent, NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NewDesktopNavbar() {
  const pathname = usePathname();

  return (
    <NavbarContent className="hidden md:flex gap-6" justify="start">
      {MENU_ITEMS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <NavbarItem key={link.href} isActive={isActive}>
            <Link
              href={link.href}
              className={`text-sm font-medium transition-opacity hover:opacity-70 ${
                isActive ? 'text-secondary' : 'text-default-500'
              }`}
            >
              {link.label}
            </Link>
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
}
