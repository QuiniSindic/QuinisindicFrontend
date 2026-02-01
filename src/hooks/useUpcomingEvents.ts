import { getLive, getResults } from '@/services/matches.service';
import { getLiveMatches, getMatchDataV2 } from '@/services/new_matches.service';
import { useQuery } from '@tanstack/react-query';

// export const useUpcomingEventsQuery = (
//   sport?: string,
//   competitionId?: number,
// ) => {
//   return useQuery({
//     queryKey: ['events', sport, competitionId],
//     queryFn: () => getUpcoming(sport, competitionId),
//     refetchOnMount: false,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 5, // 5 minutos
//   });
// };

export const useUpcomingEventsQueryV2 = (
  sport?: number,
  competitionId?: number,
  options?: { refetchInterval?: number }, // Añadimos opciones
) => {
  return useQuery({
    queryKey: ['events', sport, competitionId],
    queryFn: () => getLiveMatches(sport, competitionId),
    refetchOnMount: false,
    refetchInterval: 1000 * 60, // 30 segundos
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
    ...options,
  });
};

export const useLiveEventsQuery = (sport?: string, competitionId?: number) => {
  return useQuery({
    queryKey: ['live_events', sport, competitionId],
    queryFn: () => getLive(sport, competitionId),
    retry: 2,
    refetchInterval: 1000 * 30, // 30 segundos
    refetchIntervalInBackground: true, // tab no active
    refetchOnReconnect: true, // al reconectar
    refetchOnMount: false, // al montar
    refetchOnWindowFocus: false, // al enfocar ventana
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useResultsEventsQuery = (
  sport?: string,
  competitionId?: number,
) => {
  return useQuery({
    queryKey: ['results', sport, competitionId],
    queryFn: () => getResults(sport, competitionId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// export const useGetMatchQuery = (matchId: number) => {
//   return useQuery({
//     queryKey: ['event', matchId],
//     queryFn: () => getMatchData(matchId),
//     enabled: Boolean(matchId),
//     refetchOnMount: 'always',
//     refetchOnWindowFocus: false,
//     refetchInterval: 1000 * 30, // 30 segundos
//     staleTime: 0,
//   });
// };

export const useGetMatchQueryV2 = (matchId: number) => {
  return useQuery({
    queryKey: ['event', matchId],
    queryFn: () => getMatchDataV2(matchId),
    enabled: Boolean(matchId),
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 30, // 30 segundos
    staleTime: 0,
  });
};
