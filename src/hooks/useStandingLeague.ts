import { getStandingLeaguesV2 } from '@/services/standings.service';
import { COMPETITIONS_ID_MAP, LeagueName } from '@/utils/sports.utils';
import { useQuery } from '@tanstack/react-query';

// export const useStandingsQuery = (competition?: string) => {
//   const slug = competition
//     ? leaguesMap[competition as keyof typeof leaguesMap]
//     : undefined;
//   return useQuery({
//     queryKey: ['standings', competition],
//     queryFn: () => getStandingLeagues(slug!),
//     enabled: !!competition,
//     staleTime: 1000 * 60 * 5, // 5 minutos
//   });
// };

export const useStandingsQueryV2 = (competition?: string) => {
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
