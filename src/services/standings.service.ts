import { createClient } from '@/utils/supabase/client';

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
