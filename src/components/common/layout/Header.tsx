'use client';

import { ThemeToggleButton } from '@/components/ui/theme/ThemeToggleButton';
import { useAuth } from '@/hooks/logic/useAuth';
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import AvatarUser from './header/AvatarUser';
import { Brand } from './header/Brand';
import DesktopNavbar from './header/DesktopNavbar';

export default function Header() {
  const { data, isLoading } = useAuth();

  return (
    <Navbar
      maxWidth="full"
      className="h-16 bg-background/80 backdrop-blur-md border-b border-border"
      classNames={{
        wrapper: 'relative px-4', // 'relative' es clave para el centrado absoluto
      }}
    >
      {/* 1. LADO IZQUIERDO (Desktop) */}
      <NavbarContent justify="start" className="gap-8">
        <NavbarBrand className="hidden md:flex text-nowrap">
          <Brand />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="start">
        <DesktopNavbar />
      </NavbarContent>

      <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Brand showText={false} />
      </div>

      <NavbarContent justify="end" className="gap-4">
        {!data && !isLoading && (
          <div className="hidden md:flex items-center">
            <ThemeToggleButton />
          </div>
        )}

        <div className="hidden md:flex">
          <AvatarUser />
        </div>
      </NavbarContent>
    </Navbar>
  );
}
