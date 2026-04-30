import { getBracketMatches } from '@/services/browser/matches.service';
import { BracketRoundData } from '@/types/domain/bracket';
import { useQuery } from '@tanstack/react-query';

export const useBracketMatches = (
  competitionId?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['bracketMatches', competitionId],
    queryFn: (): Promise<BracketRoundData[]> => getBracketMatches(competitionId!),
    enabled: !!competitionId && enabled, // solo si hay id
    staleTime: 1000 * 60 * 30, // 30 min
  });
};
