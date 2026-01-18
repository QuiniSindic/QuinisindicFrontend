'use client';

import { useDisclosure } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <BottomNav isOpen={isOpen} onOpen={onOpen} pathname={pathname} />
      <MobileDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
