import { CompetitionStandingsSnapshot } from '@/types/domain/standings';
import { serverApiFetch } from '@/utils/api/server';
import { ApiError } from '@/utils/api/shared';

export async function getServerCompetitionStandings(
  competitionId: number,
  stageId?: string,
  groupId?: string,
): Promise<CompetitionStandingsSnapshot | null> {
  try {
    return await serverApiFetch<CompetitionStandingsSnapshot>({
      path: `/api/v2/football/standings/${competitionId}`,
      query: {
        stage_id: stageId,
        group_id: groupId,
      },
      auth: false,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error('Error fetching server standings from backend:', error);
    return null;
  }
}
