import { CompetitionOption } from '@/types/domain/competitions';
import { normalizeCountryLabel } from '@/utils/domain/country';
import { createClient } from '@/utils/supabase/client';

export const getCompetitionsBySport = async (
  sportId: number,
): Promise<CompetitionOption[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('competitions')
    .select('id, name, country')
    .eq('sport_id', sportId)
    .order('country', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as CompetitionOption[]).map((competition) => ({
    id: competition.id,
    name: competition.name,
    country: normalizeCountryLabel(competition.country),
  }));
};
