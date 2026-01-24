import { BarChart2, Home, LucideProps, Trophy } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

type HeaderMenuItem = {
  label: string;
  href: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
};

export const BOTTOM_NAV_ITEMS: HeaderMenuItem[] = [
  { label: 'Home', href: '/home', icon: Home },
  { label: 'Quiniela', href: '/quiniela', icon: Trophy },
  { label: 'Ranking', href: '/leaderboard', icon: BarChart2 },
];

export const PC_HEADER_ITEMS: HeaderMenuItem[] = [
  { label: 'Eventos', href: '/events' },
  { label: 'Predicciones', href: '/predictions' },
  { label: 'Quiniela', href: '/quiniela' },
  { label: 'Ranking', href: '/leaderboard' },
  { label: 'Resultados', href: '/results' },
  { label: 'Perfil', href: '/profile' },
];
