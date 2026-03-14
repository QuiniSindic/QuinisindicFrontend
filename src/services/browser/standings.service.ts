import { createClient } from '@/utils/supabase/client';
import { mapStandingTeam } from '@/services/shared/standings.mapper';

interface RawStandingTeam {
  id: string;
  position: number;
  name: string;
  badge: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  form: Array<{ result: string; match_id: string; result_code: number }>;
}

export const getStandingLeagues = async (competitionId: number) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('competitions')
    .select('standings')
    .eq('id', competitionId)
    .single();

  if (error || !data) {
    console.error('Error fetching standings:', error);
    return [];
  }

  return ((data.standings as RawStandingTeam[] | null) || []).map(
    mapStandingTeam,
  );
};
