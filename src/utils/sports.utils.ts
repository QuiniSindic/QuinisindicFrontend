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
      // 'UEFA Conference League',
      // 'La Liga Hypermotion',
      // 'Europa League',
      // 'Copa del Rey',
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
