import { getLiveMatches, getPastMatches } from '@/services/new_matches.service';
import { CompetitionData } from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';
import { EventFilters } from '@/types/domain/filters';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

type MatchesFetcher = (
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
) => Promise<CompetitionData[]>;

interface UseMatchesByFiltersParams {
  queryKeyBase: 'events' | 'results';
  fetcher: MatchesFetcher;
  filters: EventFilters;
  initialData?: CompetitionData[];
  queryOptions?: Omit<
    UseQueryOptions<CompetitionData[], Error>,
    'queryKey' | 'queryFn'
  >;
}

export const useMatchesByFilters = ({
  queryKeyBase,
  fetcher,
  filters,
  initialData,
  queryOptions,
}: UseMatchesByFiltersParams) => {
  const sportId = filters.sportId ?? undefined;
  const competitionId = filters.competitionId ?? undefined;
  const from = filters.from || undefined;
  const to = filters.to || undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKeyBase, sportId, competitionId, from, to],
    queryFn: () => fetcher(sportId, competitionId, from, to),
    initialData,
    ...queryOptions,
  });

  const events = useMemo(() => {
    if (!data) return [];
    return data.flatMap((league) => league.matches) as MatchData[];
  }, [data]);

  return { events, isLoading, isError, error };
};

export const useUpcomingMatchesByFilters = (
  filters: EventFilters,
  initialData?: CompetitionData[],
) =>
  useMatchesByFilters({
    queryKeyBase: 'events',
    fetcher: getLiveMatches,
    filters,
    initialData,
    queryOptions: {
      refetchInterval: 1000 * 60, // cada 1min
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  });

export const usePastMatchesByFilters = (
  filters: EventFilters,
  initialData?: CompetitionData[],
) =>
  useMatchesByFilters({
    queryKeyBase: 'results',
    fetcher: getPastMatches,
    filters,
    initialData,
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  });
