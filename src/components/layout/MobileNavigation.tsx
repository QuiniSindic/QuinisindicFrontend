'use client';

import { useDisclosure } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';

export function MobileNavigation() {
  const pathname = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none">
      <BottomNav isOpen={isOpen} onOpen={onOpen} pathname={pathname} />
      <MobileDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
