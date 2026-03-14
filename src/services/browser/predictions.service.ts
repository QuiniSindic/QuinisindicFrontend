import { Prediction } from '@/types/database/table';
import {
  PredictionPayload,
  PredictionUpdatePayload,
} from '@/types/domain/prediction';
import { createClient } from '@/utils/supabase/client';

export async function getEventPredictions(
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

  return (data ?? []) as Prediction[];
}

export async function getUserMatchPrediction(eventId: number) {
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
    console.error('Error fetching user prediction:', error);
  }

  return (data as Prediction | null) ?? null;
}

export async function saveEventPrediction(payload: PredictionPayload) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('predictions')
    .insert({
      user_id: user.id,
      sport_id: payload.sport_id,
      competition_id: payload.competition_id,
      match_id: payload.event_id,
      home_score: payload.home_score,
      away_score: payload.away_score,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya tienes una prediccion para este partido');
    }
    throw new Error(error.message);
  }

  return { ok: true, data };
}

export async function updateEventPrediction(
  eventId: number,
  updatePayload: PredictionUpdatePayload,
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('predictions')
    .update({
      home_score: updatePayload.home_score,
      away_score: updatePayload.away_score,
    })
    .eq('match_id', eventId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return { ok: true, data };
}
