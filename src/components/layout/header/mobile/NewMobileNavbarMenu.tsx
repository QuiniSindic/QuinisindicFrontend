'use client';

import { MENU_ITEMS } from '@/src/utils/header.utils';
import { NavbarMenu, NavbarMenuItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NewMobileNavbarMenu() {
  const pathname = usePathname();

  return (
    <NavbarMenu className="bg-background/95 backdrop-blur-md pt-8">
      {MENU_ITEMS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <NavbarMenuItem key={link.href}>
            <Link
              href={link.href}
              className={`w-full py-2 text-xl font-semibold ${
                isActive ? 'text-primary' : 'text-default-500'
              }`}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        );
      })}
    </NavbarMenu>
  );
}
