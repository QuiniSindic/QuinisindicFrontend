'use client';

import { StatusFilter } from '@/components/filters/StatusFilter';
import MatchWidget from '@/components/ui/matchWidget/MatchWidget';
import { useLocalEventFilters } from '@/hooks/useLocalEventFilters';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { MatchData } from '@/types/domain/events';
import { isFinished, isLive } from '@/utils/domain/events';
import {
  COMPETITIONS_ID_MAP,
  SPORT_ID_MAP,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface EventsListProps {
  full?: boolean;
  isLoading?: boolean;
  mode?: 'events' | 'results';
  data: MatchData[];
}

export default function EventsList({
  full = false,
  isLoading = false,
  mode = 'events',
  data = [],
}: EventsListProps) {
  const displayedEvents = useLocalEventFilters({ data, mode, full });
  const {
    selectedSport,
    selectedLeague,
    selectedFrom,
    selectedTo,
    statusFilter,
  } = useSportsFilter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const returnTo = queryString ? `${pathname}?${queryString}` : pathname;
  const shouldIncludeReturnTo = returnTo !== '/home';
  const sportSlug = selectedSport ? SPORTS_MAP[selectedSport] : undefined;
  const sportId = sportSlug ? SPORT_ID_MAP[sportSlug] : undefined;
  const competitionId = selectedLeague
    ? COMPETITIONS_ID_MAP[selectedLeague]
    : undefined;

  const params = new URLSearchParams();
  params.set('mode', mode);
  if (mode === 'events' && statusFilter !== 'all') {
    params.set('status', statusFilter);
  }
  if (sportId) params.set('sport_id', String(sportId));
  if (competitionId) params.set('competition_id', String(competitionId));
  if (selectedFrom) params.set('from', selectedFrom);
  if (selectedTo) params.set('to', selectedTo);

  if (isLoading) {
    // Skeleton simple o texto
    return (
      <div className="text-center text-muted py-8 animate-pulse">
        Cargando eventos...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mode === 'events' && <StatusFilter />}

      {displayedEvents.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-border/50">
          <p className="text-muted">No se encontraron eventos.</p>
          {mode === 'results' && (
            <p className="text-xs text-muted/60 mt-1">
              Prueba cambiando los filtros de fecha.
            </p>
          )}
        </div>
      ) : (
        displayedEvents.map((event) => {
          const live = isLive(event.status);
          const finished = isFinished(event.status);
          const eventBaseUrl = `/event/${event.id}`;
          const contextQuery = params.toString();
          const eventBaseWithContext = contextQuery
            ? `${eventBaseUrl}?${contextQuery}`
            : eventBaseUrl;
          const eventUrl = shouldIncludeReturnTo
            ? `${eventBaseWithContext}${contextQuery ? '&' : '?'}returnTo=${encodeURIComponent(returnTo)}`
            : eventBaseWithContext;

          return (
            <Link
              // Prefetch false para ahorrar ancho de banda en listas largas,
              // a menos que sea muy probable que el usuario haga click
              prefetch={false}
              href={eventUrl}
              key={event.id}
              className="block" // Asegura que el Link se comporte como bloque
            >
              <MatchWidget event={event} isLive={live} isFinished={finished} />
            </Link>
          );
        })
      )}

      {!full && data.length > 6 && (
        <div className="text-center pt-2">
          <Link
            href="/events"
            className="inline-block px-4 py-2 text-sm font-semibold text-brand bg-brand/10 hover:bg-brand/20 rounded-full transition-colors"
          >
            Ver todos los eventos
          </Link>
        </div>
      )}
    </div>
  );
}
