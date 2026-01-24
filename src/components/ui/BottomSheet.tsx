'use client';

import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';

type BottomSheetProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({
  open,
  title,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <Drawer
      isOpen={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      onClose={onClose}
      placement="bottom"
      size="3xl" // o full
      backdrop="opaque" // "transparent" | "blur-sm"
      // shouldBlockScroll={true} // ya viene true por defecto
      classNames={{
        base:
          'rounded-t-2xl bg-surface text-text border border-border shadow-lg ' +
          'focus:outline-none',
        header: 'border-b border-border px-4 py-3',
        body: 'px-2 pb-4',
        backdrop: 'bg-background/80 backdrop-blur-sm', // optional but nice
        closeButton:
          'text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-md',
      }}
    >
      <DrawerContent>
        {title ? (
          <DrawerHeader className="text-base font-semibold">
            {title}
          </DrawerHeader>
        ) : null}

        <DrawerBody className="p-2">{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
