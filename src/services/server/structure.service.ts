import {
  CompetitionEditionLite,
  CompetitionStructure,
} from '@/types/domain/competitions';
import { serverApiFetch } from '@/utils/api/server';
import { ApiError } from '@/utils/api/shared';

const normalizeStructure = (
  structure: CompetitionStructure,
): CompetitionStructure => ({
  ...structure,
  stages: structure.stages.map((stage) => ({
    ...stage,
    matches: stage.matches ?? [],
    groups:
      stage.groups?.map((group) => ({
        ...group,
        matches: group.matches ?? [],
      })) ?? [],
  })),
});

export async function getServerCompetitionStructure(
  competitionId: number,
): Promise<CompetitionStructure | null> {
  try {
    const season = await serverApiFetch<CompetitionEditionLite>({
      path: `/api/v2/football/competitions/${competitionId}/current-season`,
      auth: false,
    });

    const structure = await serverApiFetch<CompetitionStructure>({
      path: `/api/v2/football/seasons/${season.id}/overview`,
      auth: false,
    });

    return normalizeStructure(structure);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error('Error fetching server competition structure from backend:', error);
    return null;
  }
}
