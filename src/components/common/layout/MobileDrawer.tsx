'use client';

import { logout } from '@/actions/auth';
import { ThemeToggleButton } from '@/components/ui/theme/ThemeToggleButton';
import { useAuth } from '@/hooks/logic/useAuth';
import { useThemeMode } from '@/hooks/ui/useThemeMode';
import { PC_HEADER_ITEMS } from '@/utils/ui/navigation';
import { Avatar, Modal, ModalBody, ModalContent } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ isOpen, onOpenChange }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useAuth();
  const { isDark } = useThemeMode();

  const handleLogout = async () => {
    try {
      await logout();

      // Limpiamos caché y refrescamos
      queryClient.setQueryData(['user'], null);
      await queryClient.invalidateQueries({ queryKey: ['user'] });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="bottom"
      backdrop="blur"
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: 'easeOut' },
          },
          exit: {
            y: '100%',
            opacity: 0,
            transition: { duration: 0.2, ease: 'easeIn' },
          },
        },
      }}
      classNames={{
        base: 'rounded-t-2xl mb-0 sm:mb-0 w-full max-h-[85vh] h-auto bg-surface border border-border shadow-xl outline-none',
        wrapper: 'items-end z-[9999]',
        backdrop: 'z-[9998]',
        closeButton: `
          top-4 right-4 z-50 p-2 rounded-full outline-none
          text-muted hover:text-text active:bg-background
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          focus-visible:ring-offset-surface
        `,
      }}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody className="px-4 pt-12 pb-8 relative flex-none text-text">
            {/* Barra visual superior */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-border rounded-full" />

            <div className="flex flex-col gap-1 items-stretch">
              {/* === ZONA USUARIO (LOGUEADO) === */}
              {user && (
                <div className="flex flex-col gap-2 mb-2">
                  {/* Perfil */}
                  <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 w-full rounded-xl p-2 transition-colors hover:bg-background border border-transparent hover:border-border"
                  >
                    <Avatar
                      isBordered
                      name={user.email?.substring(0, 2).toUpperCase()}
                      className="w-10 h-10 text-sm bg-surface text-text border-border shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm truncate text-text">
                        {user.username ?? 'Usuario'}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {user.email}
                      </p>
                    </div>
                    {/* Flecha */}
                    <div className="text-muted/50">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>

                  {/* Botonera Logueado */}
                  <div className="grid grid-cols-2 gap-2 px-1">
                    <Link
                      href="/settings"
                      onClick={onClose}
                      className="flex items-center justify-center py-2.5 px-3 rounded-lg bg-surface border border-border text-xs font-semibold text-text hover:bg-background transition-colors"
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center py-2.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>

                  <div className="h-px w-full bg-border/50 my-1" />
                </div>
              )}

              {/* === ZONA INVITADO (NO LOGUEADO) - DISEÑO MEJORADO === */}
              {!user && (
                <div className="mb-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    // Este diseño imita al perfil pero invitando a entrar
                    className="flex items-center gap-3 w-full rounded-xl p-2 transition-colors bg-brand/5 border border-brand/10 hover:bg-brand/10 group"
                  >
                    {/* Icono de usuario genérico */}
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0 group-hover:scale-105 transition-transform">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-text group-hover:text-brand transition-colors">
                        Acceso Usuarios
                      </p>
                      <p className="text-xs text-muted">
                        Inicia sesión o regístrate
                      </p>
                    </div>

                    {/* Flecha de acción */}
                    <div className="text-brand/50 group-hover:text-brand group-hover:translate-x-0.5 transition-all">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>

                  <div className="h-px w-full bg-border/50 my-3" />
                </div>
              )}

              {/* === NAVEGACIÓN PRINCIPAL === */}
              {PC_HEADER_ITEMS.map((item) => {
                if (item.href === '/profile') return null;

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`block w-full py-3 px-3 rounded-xl transition-colors text-sm font-medium
                      ${
                        isActive
                          ? 'text-brand bg-brand/10 font-semibold'
                          : 'text-text hover:bg-background'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* === FOOTER === */}
              <div className="my-2 h-px w-full bg-border" />

              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-muted">
                  {isDark ? 'Modo Oscuro' : 'Modo Claro'}
                </span>
                <ThemeToggleButton />
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
