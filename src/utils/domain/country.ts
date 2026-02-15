const COUNTRY_LABEL_MAP: Record<string, string> = {
  DE: 'Alemania',
  ES: 'España',
  FR: 'Francia',
  EN: 'Inglaterra',
  IT: 'Italia',

  EU: 'Europa',
  INT: 'Internacional',

  LATAM: 'Sudamerica',
};

export const normalizeCountryLabel = (country?: string | null): string => {
  const raw = country?.trim();
  if (!raw) return 'Otros';

  const normalized = COUNTRY_LABEL_MAP[raw.toUpperCase()];
  return normalized || raw;
};
