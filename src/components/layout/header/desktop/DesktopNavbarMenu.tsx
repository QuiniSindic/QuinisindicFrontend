import { ThemeSwitcher } from '@/src/components/ui/theme/ThemeSwitcher';
import { useAuth } from '@/src/hooks/useAuth';
import { MENU_ITEMS } from '@/src/utils/header.utils';
import { Button, Divider, User } from '@heroui/react';
import Link from 'next/link';
import { useEffect } from 'react';

interface DesktopNavbarMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const DesktopNavbarMenu = ({
  open,
  onClose,
}: DesktopNavbarMenuProps) => {
  const { data: user } = useAuth();

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r border-divider z-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-end p-4 border-b border-divider">
          <Button
            variant="light"
            size="sm"
            radius="md"
            onPress={onClose}
            className="min-w-0 px-3"
          >
            <svg
              className="w-5 h-5 text-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Perfil (si logeado) */}
          {user && (
            <>
              <User
                name={user.username ?? 'Tu cuenta'}
                description={user.email ?? ''}
                className="mb-4"
                avatarProps={{
                  name: (user.username ?? 'U').slice(0, 2).toUpperCase(),
                  className: 'bg-secondary/80 text-white',
                  showFallback: true,
                }}
              />
              <Divider className="my-4" />
            </>
          )}

          {/* Enlaces */}
          <nav className="flex flex-col gap-1">
            {MENU_ITEMS.map((item) => (
              <Button
                key={item.href}
                as={Link}
                href={item.href}
                onPress={onClose}
                variant="light"
                radius="md"
                className="justify-start h-12"
                fullWidth
              >
                {item.label}
              </Button>
            ))}
          </nav>

          <Divider className="my-4" />

          {/* Tema */}
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">Tema</span>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Footer con acciones auth si logeado */}
        {user && (
          <div className="p-4 border-t border-divider">
            <div className="flex flex-col gap-2">
              <form action="/api/logout" method="post" className="w-full">
                <Button type="submit" color="danger" radius="md" fullWidth>
                  Cerrar sesión
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
