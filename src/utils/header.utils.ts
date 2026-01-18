type HeaderMenuItem = {
  label: string;
  href: string;
};

export const MENU_ITEMS: HeaderMenuItem[] = [
  { label: 'Clasificación', href: '/leaderboard' },
  { label: 'Eventos', href: '/events' },
  { label: 'Perfil', href: '/profile' },
  { label: 'Predicciones', href: '/predictions' },
  { label: 'Quiniela', href: '/quiniela' },
  { label: 'Resultados', href: '/results' },
];
