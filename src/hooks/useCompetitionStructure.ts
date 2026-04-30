import { getCompetitionStructure } from '@/services/browser/structure.service';
import { CompetitionStructure } from '@/types/domain/competitions';
import { useQuery } from '@tanstack/react-query';

export const useCompetitionStructure = (
  competitionId?: number | null,
  initialData?: CompetitionStructure | null,
) => {
  return useQuery({
    queryKey: ['competition-structure', competitionId],
    queryFn: () => getCompetitionStructure(competitionId!),
    enabled: !!competitionId && competitionId > 0,
    initialData,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
