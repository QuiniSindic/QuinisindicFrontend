import {
  PredictionRow,
  PredictionPayload,
  PredictionUpdatePayload,
} from '@/types/domain/prediction';
import { browserApiFetch } from '@/utils/api/browser';
import { ApiError } from '@/utils/api/shared';

export async function getEventPredictions(
  eventId: number,
): Promise<PredictionRow[]> {
  try {
    return await browserApiFetch<PredictionRow[]>({
      path: `/api/v2/football/events/${eventId}/predictions`,
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching predictions from backend:', error);
    return [];
  }
}

export async function getUserMatchPrediction(
  eventId: number,
): Promise<PredictionRow | null> {
  try {
    return await browserApiFetch<PredictionRow | null>({
      path: `/api/v2/football/events/${eventId}/predictions/me`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error('Error fetching user prediction from backend:', error);
    return null;
  }
}

export async function saveEventPrediction(payload: PredictionPayload) {
  const data = await browserApiFetch<PredictionRow>({
    path: `/api/v2/football/events/${payload.event_id}/predictions`,
    method: 'POST',
    body: payload,
  });

  return { ok: true, data };
}

export async function updateEventPrediction(
  eventId: number,
  updatePayload: PredictionUpdatePayload,
) {
  const data = await browserApiFetch<PredictionRow>({
    path: `/api/v2/football/events/${eventId}/predictions`,
    method: 'PUT',
    body: updatePayload,
  });

  return { ok: true, data };
}
