import {
  PickemContest,
  PickemEntry,
  PickemLeaderboardEntry,
} from '@/types/domain/pickem';
import { serverApiFetch } from '@/utils/api/server';
import { ApiError } from '@/utils/api/shared';

export async function getServerPickemContest(
  competitionSlug = 'fifa-world-cup',
): Promise<PickemContest | null> {
  try {
    return await serverApiFetch<PickemContest>({
      path: '/api/v2/pickem/contests/current',
      query: { competition_slug: competitionSlug },
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching pickem contest from backend:', error);
    return null;
  }
}

export async function getServerPickemEntry(
  contestId: number,
): Promise<PickemEntry | null> {
  try {
    return await serverApiFetch<PickemEntry>({
      path: `/api/v2/pickem/contests/${contestId}/me`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    console.error('Error fetching pickem entry from backend:', error);
    return null;
  }
}

export async function getServerPickemLeaderboard(
  contestId: number,
): Promise<PickemLeaderboardEntry[]> {
  try {
    return await serverApiFetch<PickemLeaderboardEntry[]>({
      path: `/api/v2/pickem/contests/${contestId}/leaderboard`,
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching pickem leaderboard from backend:', error);
    return [];
  }
}
