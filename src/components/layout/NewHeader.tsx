'use client';

import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import { Brand } from './header/Brand';
import AvatarUser from './header/NewAvatar';
import NewDesktopNavbar from './header/desktop/NewDesktopNavbar';

export default function Header() {
  return (
    <Navbar
      maxWidth="full"
      className="h-16 bg-background/80 backdrop-blur-md border-b border-divider"
      classNames={{
        wrapper: 'relative px-4',
      }}
    >
      <NavbarContent justify="start" className="gap-8">
        <NavbarBrand className="hidden md:flex text-nowrap">
          <Brand />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="start">
        <NewDesktopNavbar />
      </NavbarContent>
      <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Brand showText={false} />
      </div>

      <NavbarContent justify="end">
        <div className="hidden md:flex">
          <AvatarUser />
        </div>
      </NavbarContent>
    </Navbar>
  );
}
