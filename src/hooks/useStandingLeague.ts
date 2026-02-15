import { getStandingLeagues } from '@/services/standings.service';
import {
  getCompetitionIdByLeagueName,
  LeagueName,
} from '@/utils/domain/sports';
import { useQuery } from '@tanstack/react-query';

export const useStandingsQuery = (
  competition?: string,
  competitionIdInput?: number | null,
) => {
  const competitionId =
    competitionIdInput ??
    getCompetitionIdByLeagueName(competition as LeagueName | null);

  return useQuery({
    queryKey: ['standings', competitionId],
    queryFn: () => getStandingLeagues(competitionId!),
    enabled: !!competitionId && competitionId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
