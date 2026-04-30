import { PredictionRow, PredictionView } from '@/types/domain/prediction';
import { serverApiFetch } from '@/utils/api/server';
import { ApiError } from '@/utils/api/shared';

export async function getServerEventPredictions(
  eventId: number,
): Promise<PredictionRow[]> {
  try {
    return await serverApiFetch<PredictionRow[]>({
      path: `/api/v2/football/events/${eventId}/predictions`,
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching server event predictions from backend:', error);
    return [];
  }
}

export async function getServerUserMatchPrediction(
  eventId: number,
): Promise<PredictionRow | null> {
  try {
    return await serverApiFetch<PredictionRow | null>({
      path: `/api/v2/football/events/${eventId}/predictions/me`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error('Error fetching server user prediction from backend:', error);
    return null;
  }
}

export async function getServerPredictionsFeed(): Promise<PredictionView[]> {
  try {
    return await serverApiFetch<PredictionView[]>({
      path: '/api/v2/football/predictions/feed',
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching server predictions feed from backend:', error);
    return [];
  }
}
