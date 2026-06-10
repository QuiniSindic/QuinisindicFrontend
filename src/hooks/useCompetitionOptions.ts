import { getCompetitionsBySport } from '@/services/browser/competitions.service';
import { CompetitionOption } from '@/types/domain/competitions';
import { useQuery } from '@tanstack/react-query';

export type { CompetitionOption };

export const useCompetitionOptions = (
  sportId?: number,
  initialData?: CompetitionOption[],
) => {
  return useQuery({
    queryKey: ['competitions-by-sport', sportId],
    enabled: !!sportId,
    queryFn: async (): Promise<CompetitionOption[]> =>
      getCompetitionsBySport(sportId!),
    initialData,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
