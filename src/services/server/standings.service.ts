import { TeamStandingData } from '@/types/domain/standings';
import { mapStandingTeam } from '@/services/shared/standings.mapper';
import { createClient } from '@/utils/supabase/server';

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
  form: TeamStandingData['form'];
}

export async function getServerStandingLeagues(
  competitionId: number,
): Promise<TeamStandingData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('competitions')
    .select('standings')
    .eq('id', competitionId)
    .single();

  if (error || !data) {
    console.error('Error fetching server standings:', error);
    return [];
  }

  return ((data.standings as RawStandingTeam[] | null) || []).map(
    mapStandingTeam,
  );
}
