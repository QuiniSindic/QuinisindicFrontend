import {
  LeaderboardEntry,
  LeaderboardFilterOption,
} from '@/types/domain/leaderboard';
import { serverApiFetch } from '@/utils/api/server';

export async function getServerLeaderboard(
  scope: 'global' | 'sport' | 'competition',
  filterId: number | null,
): Promise<LeaderboardEntry[]> {
  try {
    return await serverApiFetch<LeaderboardEntry[]>({
      path: '/api/v2/leaderboard',
      query: {
        scope,
        filter_id: filterId,
      },
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching server leaderboard from backend:', error);
    return [];
  }
}

export async function getServerLeaderboardFilterOptions(): Promise<{
  sports: LeaderboardFilterOption[];
  competitions: LeaderboardFilterOption[];
}> {
  try {
    return await serverApiFetch<{
      sports: LeaderboardFilterOption[];
      competitions: LeaderboardFilterOption[];
    }>({
      path: '/api/v2/leaderboard/filters',
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching leaderboard filters from backend:', error);
    return {
      sports: [],
      competitions: [],
    };
  }
}
