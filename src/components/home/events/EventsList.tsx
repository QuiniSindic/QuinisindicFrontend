'use client';

import { StatusFilter } from '@/components/filters/StatusFilter';
import MatchWidget from '@/components/ui/matchWidget/MatchWidget';
import { useEventFiltersNavigation } from '@/hooks/useEventFiltersNavigation';
import { useLocalEventFilters } from '@/hooks/useLocalEventFilters';
import { MatchData } from '@/types/domain/events';
import { EventFilters } from '@/types/domain/filters';
import { isFinished, isLive } from '@/utils/domain/events';
import { buildEventSearchParams } from '@/utils/domain/filterParams';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface EventsListProps {
  full?: boolean;
  isLoading?: boolean;
  data: MatchData[];
  filters: EventFilters;
  currentPath?: string;
}

export function EventsList({
  full = false,
  isLoading = false,
  data = [],
  filters,
  currentPath,
}: EventsListProps) {
  const { setStatusFilter } = useEventFiltersNavigation(filters);
  const displayedEvents = useLocalEventFilters({ data, filters, full });
  const pathname = usePathname();
  const queryString = buildEventSearchParams(filters).toString();
  const resolvedPath = currentPath || pathname;
  const returnTo = queryString
    ? `${resolvedPath}?${queryString}`
    : resolvedPath;
  const shouldIncludeReturnTo = returnTo !== '/home';

  if (isLoading) {
    return (
      <div className="text-center text-muted py-8 animate-pulse">
        Cargando eventos...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filters.mode === 'events' && (
        <StatusFilter value={filters.status} onChange={setStatusFilter} />
      )}

      {displayedEvents.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-border/50">
          <p className="text-muted">No se encontraron eventos.</p>
          {filters.mode === 'results' && (
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
          const eventBaseWithContext = queryString
            ? `${eventBaseUrl}?${queryString}`
            : eventBaseUrl;
          const eventUrl = shouldIncludeReturnTo
            ? `${eventBaseWithContext}${queryString ? '&' : '?'}returnTo=${encodeURIComponent(returnTo)}`
            : eventBaseWithContext;

          return (
            <Link
              prefetch={false}
              href={eventUrl}
              key={event.id}
              className="block"
            >
              <MatchWidget event={event} isLive={live} isFinished={finished} />
            </Link>
          );
        })
      )}

      {!full && data.length > 6 && (
        <div className="text-center pt-2">
          <Link
            href={queryString ? `/events?${queryString}` : '/events'}
            className="inline-block px-4 py-2 text-sm font-semibold text-brand bg-brand/10 hover:bg-brand/20 rounded-full transition-colors"
          >
            Ver todos los eventos
          </Link>
        </div>
      )}
    </div>
  );
}
