import { useUpcomingEventsQuery } from '@/hooks/useUpcomingEvents';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import {
  COMPETITIONS_ID_MAP,
  SPORT_ID_MAP,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import { useMemo } from 'react';

export const useEventsQuery = () => {
  const { selectedSport, selectedLeague, selectedFrom, selectedTo } =
    useSportsFilter();

  const sportSlug = selectedSport ? SPORTS_MAP[selectedSport] : undefined;

  const sportId = sportSlug ? SPORT_ID_MAP[sportSlug] : undefined;

  const competitionId = selectedLeague
    ? COMPETITIONS_ID_MAP[selectedLeague]
    : undefined;

  const { data, isLoading, isError, error } = useUpcomingEventsQuery(
    sportId,
    competitionId,
    selectedFrom,
    selectedTo,
  );

  const eventsByCompetition = useMemo(() => data || [], [data]);

  const events = useMemo(() => {
    if (!data) return [];
    // flatMap recorre las ligas y saca los partidos de cada una a un array común
    return data.flatMap((league) => league.matches);
  }, [data]);

  return {
    events, // MatchData[] -> todos los partidos
    eventsByCompetition, // CompetitionData[] -> partidos por competicion
    isLoading,
    isError,
    error,
  };
};
