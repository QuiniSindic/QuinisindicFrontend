import { getPastMatches } from '@/services/new_matches.service';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import {
  getCompetitionIdByLeagueName,
  SPORT_ID_MAP,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useResultsQuery = () => {
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

  // Convertimos nulls a undefined
  const f = selectedFrom || undefined;
  const t = selectedTo || undefined;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['results', sportId, competitionId, f, t],
    queryFn: () => getPastMatches(sportId, competitionId, f, t),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const events = useMemo(() => {
    if (!data) return [];
    return data.flatMap((league) => league.matches);
  }, [data]);

  return { events, isLoading, isError, error };
};
