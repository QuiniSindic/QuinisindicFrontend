import {
  getLiveMatches,
  getMatchData,
} from '@/services/browser/matches.service';
import { MatchData } from '@/types/domain/events';
import { useQuery } from '@tanstack/react-query';

export const useUpcomingEventsQuery = (
  sport?: number,
  competitionId?: number,
  fromDate?: string | null, // Nuevo param
  toDate?: string | null, // Nuevo param
  options?: { refetchInterval?: number }, // Añadimos opciones
) => {
  const from = fromDate || undefined;
  const to = toDate || undefined;

  return useQuery({
    queryKey: ['events', sport, competitionId, from, to],
    queryFn: () => getLiveMatches(sport, competitionId, from, to),
    refetchOnMount: false,
    refetchInterval: 1000 * 60, // 30 segundos
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
    ...options,
  });
};

export const useGetMatchQuery = (matchId: number, initialData?: MatchData) => {
  return useQuery({
    queryKey: ['event', matchId],
    queryFn: () => getMatchData(matchId),
    initialData,
    enabled: Boolean(matchId),
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 30, // 30 segundos
    staleTime: 0,
  });
};
