import { CompetitionData } from '@/types/domain/competitions';
import { BracketRoundData } from '@/types/domain/bracket';
import { MatchData } from '@/types/domain/events';
import { browserApiFetch } from '@/utils/api/browser';
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

export async function getLiveMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
  limit?: number,
): Promise<CompetitionData[]> {
  return browserApiFetch<CompetitionData[]>({
    path: '/api/v2/football/events/live',
    query: buildMatchesQuery(sport, competitionId, fromDate, toDate, limit),
    auth: false,
  });
}

export const getMatchData = async (id: number): Promise<MatchData | null> => {
  try {
    return await browserApiFetch<MatchData>({
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
};

export async function getBracketMatches(
  competitionId: number,
): Promise<BracketRoundData[]> {
  return browserApiFetch<BracketRoundData[]>({
    path: `/api/v2/football/events/bracket/${competitionId}`,
    auth: false,
  });
}

export async function getPastMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
  limit?: number,
): Promise<CompetitionData[]> {
  return browserApiFetch<CompetitionData[]>({
    path: '/api/v2/football/events/results',
    query: buildMatchesQuery(sport, competitionId, fromDate, toDate, limit),
    auth: false,
  });
}
