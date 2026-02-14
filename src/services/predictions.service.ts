import { Prediction } from '@/types/database/table';
import { CompetitionLite } from '@/types/domain/competitions';
import { MatchLite } from '@/types/domain/events';
import {
  PredictionPayload,
  PredictionUpdatePayload,
} from '@/types/domain/prediction';
import { SportLite } from '@/types/domain/sports';
import { getTeamName } from '@/utils/domain/events';
import { createClient } from '@/utils/supabase/client';
import { toSpanishSportName } from '@/utils/ui/sportName';
import { getUserUsernamesV2 } from './users.service';

//________SUPABASE

export async function getEventPredictionsV2(
  eventId: number,
): Promise<Prediction[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('match_id', eventId);

  if (error) {
    console.error('Error fetching predictions:', error);
    return [];
  }

  return data || [];
}

export async function getUserMatchPredictionV2(eventId: number) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('match_id', eventId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 es "no rows found" (normal si no ha predicho)
    console.error('Error fetching user prediction:', error);
  }

  return data;
}

export async function saveEventPredictionV2(payload: PredictionPayload) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('predictions')
    .insert({
      user_id: user.id, // Aseguramos que sea el usuario actual
      sport_id: payload.sport_id,
      competition_id: payload.competition_id,
      match_id: payload.event_id,
      home_score: payload.home_score,
      away_score: payload.away_score,
    })
    .select()
    .single();

  if (error) {
    // Si hay error de duplicado, es útil saberlo
    if (error.code === '23505')
      throw new Error('Ya tienes una predicción para este partido');
    throw new Error(error.message);
  }

  return { ok: true, data };
}

export async function updateEventPredictionV2(
  eventId: number,
  updatePayload: PredictionUpdatePayload,
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Asumimos que updatePayload trae los scores
  const { data, error } = await supabase
    .from('predictions')
    .update({
      home_score: updatePayload.home_score,
      away_score: updatePayload.away_score,
    })
    .eq('match_id', eventId)
    .eq('user_id', user.id) // Seguridad extra: solo actualizar la suya
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { ok: true, data };
}

export async function getAllPredictionsV2() {
  const supabase = createClient();

  const { data: predictionsRaw, error: predictionsError } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (predictionsError) {
    throw new Error(predictionsError.message);
  }

  const predictions = (predictionsRaw ?? []) as Prediction[];
  if (predictions.length === 0) return [];

  const matchIds = Array.from(
    new Set(predictions.map((prediction) => prediction.match_id)),
  );
  const competitionIds = Array.from(
    new Set(predictions.map((prediction) => prediction.competition_id)),
  );
  const sportIds = Array.from(
    new Set(predictions.map((prediction) => prediction.sport_id)),
  );
  const userIds = Array.from(
    new Set(predictions.map((prediction) => prediction.user_id)),
  );

  const [matchesRes, competitionsRes, sportsRes, usersMap] = await Promise.all([
    supabase
      .from('matches')
      .select(
        'id, kickoff, status, minute, home_team_data, away_team_data, home_score, away_score',
      )
      .in('id', matchIds),
    supabase.from('competitions').select('id, name').in('id', competitionIds),
    supabase.from('sports').select('id, name').in('id', sportIds),
    getUserUsernamesV2(userIds),
  ]);

  if (matchesRes.error) throw new Error(matchesRes.error.message);
  if (competitionsRes.error) throw new Error(competitionsRes.error.message);
  if (sportsRes.error) throw new Error(sportsRes.error.message);

  const matches = (matchesRes.data ?? []) as MatchLite[];
  const competitions = (competitionsRes.data ?? []) as CompetitionLite[];
  const sports = (sportsRes.data ?? []) as SportLite[];

  const matchById = new Map(matches.map((match) => [match.id, match]));
  const competitionById = new Map(
    competitions.map((competition) => [competition.id, competition]),
  );
  const sportById = new Map(sports.map((sport) => [sport.id, sport]));

  return predictions.map((prediction) => {
    const match = matchById.get(prediction.match_id);
    const competition = competitionById.get(prediction.competition_id);
    const sport = sportById.get(prediction.sport_id);
    const profile = usersMap[prediction.user_id];

    const homeTeam = getTeamName(match?.home_team_data, 'Local');
    const awayTeam = getTeamName(match?.away_team_data, 'Visitante');

    return {
      id: prediction.id,
      userId: prediction.user_id,
      username: profile?.username ?? 'Usuario',
      matchId: prediction.match_id,
      kickoff: match?.kickoff ?? prediction.created_at,
      matchStatus: match?.status ?? prediction.status,
      homeTeam,
      awayTeam,
      predicted: `${prediction.home_score} - ${prediction.away_score}`,
      homeScore: match?.home_score ?? null,
      awayScore: match?.away_score ?? null,
      minute: match?.minute ?? null,
      sportId: prediction.sport_id,
      sportName:
        toSpanishSportName(sport?.name) || `Deporte ${prediction.sport_id}`,
      competitionId: prediction.competition_id,
      competitionName: competition?.name ?? `Liga ${prediction.competition_id}`,
      points: prediction.points,
      createdAt: prediction.created_at,
    };
  });
}
