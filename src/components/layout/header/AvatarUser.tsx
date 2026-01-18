'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { logout } from '@/src/services/auth.service';
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
import { ThemeToggleButton } from '../../ui/theme/ThemeToggleButton';

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
        className="font-medium outline-none"
      >
        Iniciar sesión
      </Button>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Limpiamos la caché de React Query inmediatamente
      queryClient.setQueryData(['user'], null);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="cursor-pointer transition-transform hover:scale-105"
          color="secondary"
          // Usamos las iniciales del email o nombre
          name={user?.email?.substring(0, 2).toUpperCase()}
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Acciones de usuario" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" textValue="Perfil">
          <p className="text-xs text-default-500">Conectado como</p>
          <p className="font-semibold">{user?.email}</p>
        </DropdownItem>

        <DropdownItem key="theme" isReadOnly endContent={<ThemeToggleButton />}>
          Modo Oscuro
        </DropdownItem>

        <DropdownItem key="settings" href="/settings">
          Configuración
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          onPress={handleLogout}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
