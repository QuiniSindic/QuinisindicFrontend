import { ThemeSwitcher } from '@/src/components/ui/theme/ThemeSwitcher';
import { useAuth } from '@/src/hooks/useAuth';
import { logout } from '@/src/services/auth.service';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const AvatarActions = () => {
  const router = useRouter();
  const { data: user, isLoading, isFetching } = useAuth();
  const loading = isLoading || isFetching;
  const queryClient = useQueryClient();

  if (loading) {
    // skelton avatar
    return (
      <div className="w-8 h-8 rounded-full bg-default-200 animate-pulse" />
    );
  }

  let NEW_USER = user;

  const MOCK_USER = {
    id: '28082000',
    username: 'eli28',
    email: 'elianfl28@gmail.com',
    password: 'doifnsdf',
    provider: 'local' as 'local' | 'google',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  NEW_USER = MOCK_USER;

  if (!NEW_USER) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" aria-label="Ir a login" className="text-nowrap">
          Inicia sesión
        </Link>
        {/* CHECK fer un pensament sobre esto */}
        <span className="hidden sm:inline-flex">
          <ThemeSwitcher />
        </span>
      </div>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform cursor-pointer text-foreground-50 dark:text-foreground-900 hover:scale-105"
          color="secondary"
          name={user?.email?.substring(0, 2).toUpperCase()}
          size="sm"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Acciones de perfil" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Conectado como</p>
          <p className="font-semibold">{user?.email}</p>
        </DropdownItem>

        <DropdownItem key="settings">Configuración</DropdownItem>

        <DropdownItem
          key="themeSwitcher"
          isReadOnly
          className="flex items-center"
          endContent={<ThemeSwitcher />}
        >
          <span className="font-semibold">Tema</span>
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onPress={async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            } finally {
              queryClient.setQueryData(['user'], null);
              await queryClient.invalidateQueries({ queryKey: ['user'] });
              router.refresh();
            }
          }}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
