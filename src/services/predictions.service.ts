import { Prediction } from '@/types/database/table.types';
import {
  PredictionPayload,
  PredictionUpdatePayload,
} from '@/types/prediction.types';
import { IResponse } from '@/types/response.types';
import { createClient } from '@/utils/supabase/client';
import { BACKEND_URL } from 'core/config';

export async function getEventPredictions(
  eventId: number,
): Promise<Prediction[]> {
  const response = await fetch(
    `${BACKEND_URL}/predictions?eventId=${eventId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch event predictions');
  }
  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.error || 'Failed to fetch event predictions');
  }

  return result.data;
}

export async function saveEventPrediction(matchPayload: PredictionPayload) {
  const response = await fetch(`${BACKEND_URL}/predictions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      ...matchPayload,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to post event prediction');
  }

  const data = (await response.json()) as IResponse<Prediction>;

  return data;
}

export async function updateEventPrediction(
  eventId: number,
  updatePayload: PredictionUpdatePayload,
) {
  const response = await fetch(`${BACKEND_URL}/predictions/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      ...updatePayload,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update event prediction');
  }

  const data = (await response.json()) as IResponse<Prediction>;

  return data;
}

export async function getUserMatchPrediction(eventId: number) {
  const response = await fetch(
    `${BACKEND_URL}/predictions/my-prediction?eventId=${eventId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch user match prediction');
  }

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.error || 'Failed to fetch user match prediction');
  }

  return result.data;
}

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
