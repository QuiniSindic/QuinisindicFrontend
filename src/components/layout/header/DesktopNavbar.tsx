'use client';

import { PC_HEADER_ITEMS } from '@/utils/header.utils';
import { NavbarContent, NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNavbar() {
  const pathname = usePathname();

  const navItems = PC_HEADER_ITEMS.filter((item) => item.href !== '/profile');

  return (
    <NavbarContent className="hidden md:flex gap-6" justify="start">
      {navItems.map((link) => {
        const isActive = pathname === link.href;
        return (
          <NavbarItem key={link.href} isActive={isActive}>
            <Link
              href={link.href}
              className={`
                text-sm font-medium transition-opacity
                hover:opacity-80 
                ${isActive ? 'text-brand font-semibold' : 'text-text'}`}
            >
              {link.label}
            </Link>
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
}
