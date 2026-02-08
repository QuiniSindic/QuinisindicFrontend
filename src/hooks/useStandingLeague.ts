import { getStandingLeaguesV2 } from '@/services/standings.service';
import { COMPETITIONS_ID_MAP, LeagueName } from '@/utils/domain/sports';
import { useQuery } from '@tanstack/react-query';

export const useStandingsQuery = (competition?: string) => {
  const competitionId = competition
    ? COMPETITIONS_ID_MAP[competition as LeagueName]
    : undefined;
  return useQuery({
    queryKey: ['standings', competitionId],
    queryFn: () => getStandingLeaguesV2(competitionId!),
    enabled: !!competitionId && competitionId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
