import { createClient } from '@/utils/supabase/client';
import { BACKEND_URL } from 'core/config';

export const getStandingLeagues = async (competitionSlug: string) => {
  const competition = competitionSlug.toLowerCase();
  const response = await fetch(
    `${BACKEND_URL}/competitions/standing/${competition}`,
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || `Error fetching standing for ${competition}`);
  }

  const teams = data.data.teams;

  return teams;
};

export const getStandingLeaguesV2 = async (competitionId: number) => {
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

  return (data.standings || []).map((team: any) => ({
    id: team.id,
    position: team.position,
    name: team.name,
    badge: team.badge, // Ya viene como "8634.png"
    played: team.played,
    wins: team.wins,
    draws: team.draws,
    losses: team.losses,
    points: team.points,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,
    // Si tu tipo TeamStandingData espera un string en 'form' (ej "WWDL"),
    // mapealo aquí. Si espera el array complejo, pásalo directo.
    form: team.form,
  }));
};
