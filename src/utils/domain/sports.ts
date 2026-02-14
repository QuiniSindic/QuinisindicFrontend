export const SPORTS_LIST_ITEMS = [
  {
    name: 'Fútbol',
    leagues: [
      'La Liga',
      'Premier League',
      'Bundesliga',
      'Serie A',
      'Ligue 1',
      'Champions League',
      'Europa League',
      'Copa del Rey',
      'Mundial',
      // 'UEFA Conference League',
      // 'La Liga Hypermotion',
      // 'Mundial de Clubes',
    ],
  },
  {
    name: 'Baloncesto',
    leagues: ['NBA', 'Euroliga'],
  },
  {
    name: 'Tenis',
    leagues: [
      'Abierto de Australia',
      'Roland Garros',
      'Wimbledon',
      'Abierto de Estados Unidos',
    ],
  },
  {
    name: 'Motor',
    leagues: ['Fórmula 1', 'MotoGP'],
  },
  // {
  //   name: 'Ciclismo',
  //   leagues: ['Giro de Italia', 'Tour de Francia', 'Vuelta a España'],
  // },
] as const;

export type SportName = (typeof SPORTS_LIST_ITEMS)[number]['name'];
export type LeagueName = (typeof SPORTS_LIST_ITEMS)[number]['leagues'][number];

export const SPORTS_MAP: Record<SportName, string> = {
  Fútbol: 'football',
  Baloncesto: 'basketball',
  Tenis: 'tennis',
  Motor: 'motor',
  // Ciclismo: 'cycling',
};

export const COMPETITIONS_ID_MAP: Record<LeagueName, number> = {
  'La Liga': 87,
  'Premier League': 47,
  Bundesliga: 54,
  'Serie A': 55,
  'Ligue 1': 53,
  'Champions League': 42,
  'Copa del Rey': 138,
  'Europa League': 73,
  Mundial: 77,

  // FIX: cuando se añadan los deportes
  NBA: 0,
  Euroliga: 0,
  'Abierto de Australia': 0,
  'Roland Garros': 0,
  Wimbledon: 0,
  'Abierto de Estados Unidos': 0,
  'Fórmula 1': 0,
  MotoGP: 0,
};

// IDs arbitrarios para tus deportes (asegúrate de que coincidan con tu DB)
export const SPORT_ID_MAP: Record<string, number> = {
  football: 1,
  basketball: 2,
  tennis: 3,
  motor: 4,
  cycling: 5,
};

export const getPositionClass = (
  leagueId: number,
  position: number,
): string => {
  const defaultClass = 'text-muted';
  const championsClass = 'text-green-500 font-bold';
  const europaClass = 'text-blue-500 font-medium';
  const conferenceClass = 'text-yellow-500 font-medium';
  const relegationPlayoffClass = 'text-orange-500 font-medium';
  const relegationClass = 'text-red-500 font-medium';

  switch (leagueId) {
    case 42: // Champions League
    case 73: // Europa League
      if (position <= 8) return championsClass; // Octavos
      if (position <= 24) return europaClass; // Playoff (usamos azul para diferenciar)
      return defaultClass;

    case 87: // La Liga
      if (position <= 4) return championsClass;
      if (position === 5) return europaClass;
      if (position === 6) return conferenceClass;
      if (position >= 18) return relegationClass;
      return defaultClass;

    case 47: // Premier League
      if (position <= 4) return championsClass;
      if (position === 5) return europaClass;
      if (position >= 18) return relegationClass;
      return defaultClass;

    case 54: // Bundesliga (18 equipos)
      if (position <= 4) return championsClass;
      if (position === 5) return europaClass;
      if (position === 6) return conferenceClass;
      if (position === 16) return relegationPlayoffClass; // Playoff descenso
      if (position >= 17) return relegationClass;
      return defaultClass;

    case 55: // Serie A
      if (position <= 4) return championsClass;
      if (position === 5) return europaClass;
      if (position >= 18) return relegationClass;
      return defaultClass;

    case 53: // Ligue 1 (18 equipos)
      if (position <= 3) return championsClass;
      if (position === 4) return europaClass; // Playoff Champions (a veces azul o verde claro)
      if (position === 5) return europaClass;
      if (position === 6) return conferenceClass;
      if (position === 16) return relegationPlayoffClass;
      if (position >= 17) return relegationClass;
      return defaultClass;

    default:
      return defaultClass;
  }
};
