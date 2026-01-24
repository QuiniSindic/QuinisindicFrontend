'use client';

import MatchWidget from '@/src/components/ui/matchWidget/MatchWidget';
import { leaguesIdMap } from '@/src/constants/mappers';
import { useMatchesStore } from '@/src/store/matchesStore';
import { useResultsStore } from '@/src/store/resultsStore';
import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import { parseKickoff } from '@/src/utils/date.utils';
import {
  competitionIdsForSport,
  isFinished,
  isLive,
} from '@/src/utils/events.utils';
import Link from 'next/link';

interface EventsListProps {
  full?: boolean;
  isLoading?: boolean;
  mode?: 'events' | 'results';
}

export default function EventsList({
  full = false,
  isLoading = false,
  mode = 'events',
}: EventsListProps) {
  const { events } = useMatchesStore();
  const { results } = useResultsStore();
  const { selectedSport, selectedLeague, selectedFrom, selectedTo } =
    useSportsFilter();

  const base =
    mode === 'results'
      ? results
      : Array.isArray(events)
        ? events.filter((e) => e && !isFinished(e.status))
        : [];

  const leagueId = selectedLeague ? leaguesIdMap[selectedLeague] : undefined;

  let filtered = base;

  if (leagueId) {
    filtered = base.filter((event) => event.competitionid === leagueId);
  } else if (selectedSport) {
    const sportIds = competitionIdsForSport(selectedSport);
    filtered = base.filter((event) => sportIds.has(event.competitionid));
  }

  if (mode === 'results' && (selectedFrom || selectedTo)) {
    filtered = filtered.filter((event) => {
      const d = parseKickoff(event.kickoff); // Date

      if (!d) return null;

      if (Number.isNaN(d.getTime())) return false;

      const y = d.getFullYear();
      const m = d.getMonth();
      const day = d.getDate();
      const start = new Date(y, m, day, 0, 0, 0);
      const end = new Date(y, m, day, 23, 59, 59);

      const fromOk = selectedFrom
        ? end >= new Date(`${selectedFrom}T00:00:00`)
        : true;
      const toOk = selectedTo
        ? start <= new Date(`${selectedTo}T23:59:59`)
        : true;

      return fromOk && toOk;
    });
  }

  const displayedEvents = full ? filtered : filtered.slice(0, 6);

  return (
    <div className="space-y-2">
      {isLoading ? (
        <p className="text-center text-muted py-8">Cargando eventos...</p>
      ) : displayedEvents.length === 0 ? (
        <p className="text-center text-muted py-8">
          No hay eventos en este momento.
        </p>
      ) : (
        <>
          {displayedEvents.map((event) => {
            const status = event.status;
            const live = isLive(status);
            const finished = isFinished(status);

            return (
              <Link prefetch href={`/event/${event.id}`} key={event.id}>
                <MatchWidget
                  event={event}
                  isLive={live}
                  isFinished={finished}
                />
              </Link>
            );
          })}
          {!full && filtered.length > 6 && (
            <div className="text-center py-2">
              <Link
                href="/events"
                className="text-brand font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              >
                Ver todos los eventos
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
