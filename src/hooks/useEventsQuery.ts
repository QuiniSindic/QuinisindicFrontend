import { useUpcomingEventsQuery } from '@/hooks/useUpcomingEvents';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import {
  getCompetitionIdByLeagueName,
  SPORT_ID_MAP,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import { useMemo } from 'react';

export const useEventsQuery = () => {
  const {
    selectedSport,
    selectedLeague,
    selectedCompetitionId,
    selectedFrom,
    selectedTo,
  } =
    useSportsFilter();

  const sportSlug = selectedSport ? SPORTS_MAP[selectedSport] : undefined;

  const sportId = sportSlug ? SPORT_ID_MAP[sportSlug] : undefined;

  const competitionId =
    selectedCompetitionId ?? getCompetitionIdByLeagueName(selectedLeague);

  const { data, isLoading, isError, error } = useUpcomingEventsQuery(
    sportId,
    competitionId,
    selectedFrom,
    selectedTo,
  );

  const events = useMemo(() => {
    if (!data) return [];
    return data.flatMap((league) => league.matches);
  }, [data]);

  return {
    events,
    isLoading,
    isError,
    error,
  };
};
