'use client';

import { PC_HEADER_ITEMS } from '@/utils/header.utils';
import { NavbarContent, NavbarItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DesktopNavbar() {
  const pathname = usePathname();

  return (
    <NavbarContent className="hidden md:flex gap-6" justify="start">
      {PC_HEADER_ITEMS.map((link) => {
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
