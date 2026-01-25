'use client';

import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';
import { X } from 'lucide-react';

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
      hideCloseButton
      backdrop="opaque" // "transparent" | "blur-sm"
      classNames={{
        base: 'rounded-t-2xl bg-surface text-text border border-border shadow-lg focus:outline-none',
        body: 'px-2 pb-4 relative',
        backdrop: 'bg-background/80 backdrop-blur-sm',
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <div className="text-base font-semibold truncate pr-4">
            {title ? (
              title
            ) : (
              // Un placeholder invisible para mantener la altura si no hay título
              <span className="invisible">&nbsp;</span>
            )}
          </div>

          <button
            onClick={onClose}
            // Estilos similares a tus otros botones (puedes ajustarlos)
            className="shrink-0 p-1.5 text-muted hover:text-text bg-transparent hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Cerrar"
            type="button"
          >
            <X size={20} />
          </button>
        </DrawerHeader>

        <DrawerBody className="p-2">{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
