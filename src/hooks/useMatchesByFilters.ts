import { getLiveMatches, getPastMatches } from '@/services/new_matches.service';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { CompetitionData } from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';
import {
  getCompetitionIdByLeagueName,
  SPORT_ID_MAP,
  SPORTS_MAP,
} from '@/utils/domain/sports';
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
  queryOptions?: Omit<
    UseQueryOptions<CompetitionData[], Error>,
    'queryKey' | 'queryFn'
  >;
}

export const useMatchesByFilters = ({
  queryKeyBase,
  fetcher,
  queryOptions,
}: UseMatchesByFiltersParams) => {
  const {
    selectedSport,
    selectedLeague,
    selectedCompetitionId,
    selectedFrom,
    selectedTo,
  } = useSportsFilter();

  const sportSlug = selectedSport ? SPORTS_MAP[selectedSport] : undefined;
  const sportId = sportSlug ? SPORT_ID_MAP[sportSlug] : undefined;
  const competitionId =
    selectedCompetitionId ?? getCompetitionIdByLeagueName(selectedLeague);
  const from = selectedFrom || undefined;
  const to = selectedTo || undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKeyBase, sportId, competitionId, from, to],
    queryFn: () => fetcher(sportId, competitionId, from, to),
    ...queryOptions,
  });

  const events = useMemo(() => {
    if (!data) return [];
    return data.flatMap((league) => league.matches) as MatchData[];
  }, [data]);

  return { events, isLoading, isError, error };
};

export const useUpcomingMatchesByFilters = () =>
  useMatchesByFilters({
    queryKeyBase: 'events',
    fetcher: getLiveMatches,
    queryOptions: {
      refetchOnMount: false,
      refetchInterval: 1000 * 60,
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5,
    },
  });

export const usePastMatchesByFilters = () =>
  useMatchesByFilters({
    queryKeyBase: 'results',
    fetcher: getPastMatches,
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  });
