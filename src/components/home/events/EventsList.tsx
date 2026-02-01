'use client';

import { StatusFilter } from '@/components/filters/StatusFilter';
import MatchWidget from '@/components/ui/matchWidget/MatchWidget';
import { useLocalEventFilters } from '@/hooks/useLocalEventFilters';
import { MatchData } from '@/types/events/events.types';
import { isFinished, isLive } from '@/utils/events.utils';
import Link from 'next/link';

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

  if (isLoading) {
    // Skeleton simple o texto
    return (
      <div className="text-center text-muted py-8 animate-pulse">
        Cargando eventos...
      </div>
    );
  }

  if (displayedEvents.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-lg border border-border/50">
        <p className="text-muted">No se encontraron eventos.</p>
        {mode === 'results' && (
          <p className="text-xs text-muted/60 mt-1">
            Prueba cambiando los filtros de fecha.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mode === 'events' && <StatusFilter />}

      {displayedEvents.map((event) => {
        const live = isLive(event.status);
        const finished = isFinished(event.status);

        return (
          <Link
            // Prefetch false para ahorrar ancho de banda en listas largas,
            // a menos que sea muy probable que el usuario haga click
            prefetch={false}
            href={`/event/${event.id}`}
            key={event.id}
            className="block" // Asegura que el Link se comporte como bloque
          >
            <MatchWidget event={event} isLive={live} isFinished={finished} />
          </Link>
        );
      })}

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
