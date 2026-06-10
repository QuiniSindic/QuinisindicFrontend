import { CompetitionData } from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';
import { serverApiFetch } from '@/utils/api/server';
import { ApiError } from '@/utils/api/shared';

const buildMatchesQuery = (
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
  limit?: number,
) => ({
  sport_id: sport,
  competition_id: competitionId,
  from_date: fromDate,
  to_date: toDate,
  limit,
});

export async function getServerLiveMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
  limit?: number,
): Promise<CompetitionData[]> {
  try {
    return await serverApiFetch<CompetitionData[]>({
      path: '/api/v2/football/events/live',
      query: buildMatchesQuery(sport, competitionId, fromDate, toDate, limit),
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching live matches from backend:', error);
    return [];
  }
}

export async function getServerPastMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
  limit?: number,
): Promise<CompetitionData[]> {
  try {
    return await serverApiFetch<CompetitionData[]>({
      path: '/api/v2/football/events/results',
      query: buildMatchesQuery(sport, competitionId, fromDate, toDate, limit),
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching past matches from backend:', error);
    return [];
  }
}

export async function getServerMatchData(
  id: number,
): Promise<MatchData | null> {
  try {
    return await serverApiFetch<MatchData>({
      path: `/api/v2/football/events/${id}`,
      auth: false,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error('Error fetching match data from backend:', error);
    return null;
  }
}
