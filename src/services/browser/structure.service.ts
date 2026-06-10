import {
  CompetitionEditionLite,
  CompetitionStructure,
} from '@/types/domain/competitions';
import { browserApiFetch } from '@/utils/api/browser';
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

export async function getCompetitionStructure(
  competitionId: number,
): Promise<CompetitionStructure | null> {
  try {
    const season = await browserApiFetch<CompetitionEditionLite>({
      path: `/api/v2/football/competitions/${competitionId}/current-season`,
      auth: false,
    });

    const structure = await browserApiFetch<CompetitionStructure>({
      path: `/api/v2/football/seasons/${season.id}/overview`,
      auth: false,
    });

    return normalizeStructure(structure);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error('Error fetching competition structure from backend:', error);
    return null;
  }
}
