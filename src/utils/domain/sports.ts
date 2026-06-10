export type SportName = string;
export type LeagueName = string;

const titleize = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getSportNameBySlug = (slug?: string | null): SportName | null => {
  if (!slug) return null;
  return titleize(slug.replace(/-/g, ' '));
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
