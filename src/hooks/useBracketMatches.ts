import { getBracketMatches } from '@/services/browser/matches.service';
import { useQuery } from '@tanstack/react-query';

export const useBracketMatches = (competitionId?: number) => {
  return useQuery({
    queryKey: ['bracketMatches', competitionId],
    queryFn: () => getBracketMatches(competitionId!),
    enabled: !!competitionId, // solo si hay id
    staleTime: 1000 * 60 * 30, // 30 min
  });
};
