'use client';

import MatchWidget from '@/src/components/ui/matchWidget/MatchWidget';
import { leaguesIdMap } from '@/src/constants/mappers';
import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import { MatchData } from '@/src/types/events/events.types';
import {
  competitionIdsForSport,
  isFinished,
  isLive,
} from '@/src/utils/events.utils';
import dayjs from 'dayjs';
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
  const { selectedSport, selectedLeague, selectedFrom, selectedTo } =
    useSportsFilter();

  const base =
    mode === 'results'
      ? data
      : Array.isArray(data)
        ? data.filter((event) => event && !isFinished(event.status))
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
      const eventDate = dayjs(event.kickoff);

      if (!eventDate.isValid()) return false;

      const isAfterFrom = selectedFrom
        ? !eventDate.isBefore(selectedFrom, 'day')
        : true;
      const isBeforeTo = selectedTo
        ? !eventDate.isAfter(selectedTo, 'day')
        : true;

      return isAfterFrom && isBeforeTo;
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
