import { leaguesIdMap, leaguesMap, sportsMap } from '@/src/constants/mappers';
import {
  useLiveEventsQuery,
  useUpcomingEventsQuery,
} from '@/src/hooks/useUpcomingEvents'; // Ajusta la ruta si es necesario
import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import { concatenateAndSortEvents } from '@/src/utils/events.utils';
import { useMemo } from 'react';

export const useFilteredEvents = () => {
  const { selectedSport, selectedLeague } = useSportsFilter();

  const sportSlug = sportsMap[selectedSport as keyof typeof sportsMap];
  const competitionId = leaguesIdMap[selectedLeague as keyof typeof leaguesMap];

  const { data: upcoming_events, isLoading: isLoadingUpcoming } =
    useUpcomingEventsQuery(sportSlug, competitionId);

  const { data: live_matches, isLoading: isLoadingLive } = useLiveEventsQuery();

  // TODO fer un pensa si dejarlo o ponerlo cuando entremos en la page de results
  // (creo que mejor moverlo)
  //   const { data: results_matches } = useResultsEventsQuery();

  const mergedEvents = useMemo(
    () =>
      concatenateAndSortEvents({
        upcoming: upcoming_events ?? [],
        live: live_matches ?? [],
      }),
    [upcoming_events, live_matches],
  );

  return {
    events: mergedEvents,
    isLoading: isLoadingUpcoming || isLoadingLive,
  };
};
