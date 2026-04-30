import { CompetitionOption } from '@/types/domain/competitions';
import { browserApiFetch } from '@/utils/api/browser';

export const getCompetitionsBySport = async (
  sportId: number,
): Promise<CompetitionOption[]> => {
  return browserApiFetch<CompetitionOption[]>({
    path: '/api/v2/catalog/competitions',
    query: { sport_id: sportId },
    auth: false,
  });
};
