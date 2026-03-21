import { getStandingLeagues } from '@/services/browser/standings.service';
import { TeamStandingData } from '@/types/domain/standings';
import { useQuery } from '@tanstack/react-query';

export const useStandingsQuery = (
  competition?: string,
  competitionIdInput?: number | null,
  initialData?: TeamStandingData[],
) => {
  const competitionId = competitionIdInput ?? null;

  return useQuery({
    queryKey: ['standings', competitionId, competition],
    queryFn: () => getStandingLeagues(competitionId!),
    enabled: !!competitionId && competitionId > 0,
    initialData,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
