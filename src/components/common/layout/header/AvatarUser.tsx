'use client';

import { logout } from '@/actions/auth';
import { ThemeToggleButton } from '@/components/ui/theme/ThemeToggleButton';
import { useAuth } from '@/hooks/logic/useAuth';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AvatarUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isFetching } = useAuth();

  const loading = isLoading || isFetching;

  // Estado de carga con Skeleton para evitar saltos visuales
  if (loading) {
    return <Skeleton className="flex w-8 h-8 rounded-full" />;
  }

  // Si no hay usuario, mostramos un botón de acceso limpio
  if (!user) {
    return (
      <Button
        as={Link}
        href="/login"
        variant="flat"
        size="sm"
        className="font-medium outline-none text-text"
      >
        Iniciar sesión
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();

      queryClient.setQueryData(['user'], null);
      await queryClient.invalidateQueries({ queryKey: ['user'] });

      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Dropdown
      placement="bottom-end"
      classNames={{
        content:
          'bg-surface text-text border border-border shadow-lg rounded-xl overflow-hidden',
        base: 'outline-none',
      }}
    >
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="cursor-pointer transition-transform hover:scale-105 bg-surface text-text border-border outline-none"
          name={user?.email?.substring(0, 2).toUpperCase()}
          size="sm"
        />
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Acciones de usuario"
        variant="flat"
        className="bg-surface text-text border-0! shadow-none! ring-0!"
        classNames={{
          list: 'outline-none',
        }}
        itemClasses={{
          base: 'data-[hover=true]:bg-background data-[hover=true]:text-text',
        }}
      >
        <DropdownItem
          key="profile"
          className="h-14 gap-2 outline-none"
          textValue="Perfil"
        >
          <p className="text-xs text-muted outline-none">Conectado como</p>
          <p className="font-semibold text-text">{user?.email}</p>
        </DropdownItem>

        <DropdownItem
          key="theme"
          className="outline-none"
          isReadOnly
          endContent={<ThemeToggleButton />}
        >
          Modo Oscuro
        </DropdownItem>

        <DropdownItem key="settings" href="/settings" className="outline-none">
          Configuración
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger outline-none"
          onPress={handleLogout}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
