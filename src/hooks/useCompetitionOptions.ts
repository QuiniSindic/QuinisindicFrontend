import { createClient } from '@/utils/supabase/client';
import { normalizeCountryLabel } from '@/utils/domain/country';
import { useQuery } from '@tanstack/react-query';

export interface CompetitionOption {
  id: number;
  name: string;
  country?: string;
}

export const useCompetitionOptions = (sportId?: number) => {
  return useQuery({
    queryKey: ['competitions-by-sport', sportId],
    enabled: !!sportId,
    queryFn: async (): Promise<CompetitionOption[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('competitions')
        .select('id, name, country')
        .eq('sport_id', sportId!)
        .order('country', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((competition) => ({
        id: competition.id,
        name: competition.name,
        country: normalizeCountryLabel(competition.country),
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};
