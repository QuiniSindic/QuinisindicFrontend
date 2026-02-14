const SPORT_NAME_ES: Record<string, string> = {
  football: 'Futbol',
  soccer: 'Futbol',
  basketball: 'Baloncesto',
  tennis: 'Tenis',
  motor: 'Motor',
  motorsport: 'Motor',
  cycling: 'Ciclismo',
};

export function toSpanishSportName(name?: string | null): string {
  if (!name) return '';

  const normalized = name.trim().toLowerCase();
  return SPORT_NAME_ES[normalized] ?? name;
}
