import { CompetitionOption } from '@/hooks/useCompetitionOptions';

export interface GroupedCompetitionOptions {
  country: string;
  options: CompetitionOption[];
}

export const groupCompetitionOptionsByCountry = (
  options: CompetitionOption[],
): GroupedCompetitionOptions[] => {
  const groups = new Map<string, CompetitionOption[]>();

  options.forEach((option) => {
    const key = option.country?.trim() || 'Otros';
    const current = groups.get(key) || [];
    current.push(option);
    groups.set(key, current);
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
    .map(([country, groupOptions]) => ({
      country,
      options: [...groupOptions].sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }),
      ),
    }));
};
