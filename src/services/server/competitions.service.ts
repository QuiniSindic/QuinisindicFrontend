import { CompetitionOption } from '@/types/domain/competitions';
import { serverApiFetch } from '@/utils/api/server';

export async function getServerCompetitionsBySport(
  sportId: number,
): Promise<CompetitionOption[]> {
  try {
    return await serverApiFetch<CompetitionOption[]>({
      path: '/api/v2/catalog/competitions',
      query: { sport_id: sportId },
      auth: false,
    });
  } catch (error) {
    console.error('Error fetching server competitions from backend:', error);
    return [];
  }
}
