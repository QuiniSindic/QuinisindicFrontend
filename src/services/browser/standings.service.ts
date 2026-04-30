import { CompetitionStandingsSnapshot } from '@/types/domain/standings';
import { browserApiFetch } from '@/utils/api/browser';
import { ApiError } from '@/utils/api/shared';

export const getCompetitionStandings = async (
  competitionId: number,
  stageId?: string,
  groupId?: string,
): Promise<CompetitionStandingsSnapshot | null> => {
  try {
    return await browserApiFetch<CompetitionStandingsSnapshot>({
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

    console.error('Error fetching standings from backend:', error);
    return null;
  }
};
