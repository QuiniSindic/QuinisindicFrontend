import { getStandingLeagues } from '@/services/browser/standings.service';
import { TeamStandingData } from '@/types/domain/standings';
import {
  getCompetitionIdByLeagueName,
  LeagueName,
} from '@/utils/domain/sports';
import { useQuery } from '@tanstack/react-query';

export const useStandingsQuery = (
  competition?: string,
  competitionIdInput?: number | null,
  initialData?: TeamStandingData[],
) => {
  const competitionId =
    competitionIdInput ??
    getCompetitionIdByLeagueName(competition as LeagueName | null);

  return useQuery({
    queryKey: ['standings', competitionId],
    queryFn: () => getStandingLeagues(competitionId!),
    enabled: !!competitionId && competitionId > 0,
    initialData,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
