'use client';

import MatchWidget from '@/components/ui/matchWidget/MatchWidget';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { MatchData } from '@/types/events/events.types';
import {
  competitionIdsForSport,
  isFinished,
  isLive,
} from '@/utils/events.utils';
import { COMPETITIONS_ID_MAP } from '@/utils/sports.utils';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useMemo } from 'react';

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

  // 1. Filtrado Memoizado
  const displayedEvents = useMemo(() => {
    if (!data) return [];

    // A. Filtro base: ¿Mostrar terminados o futuros?
    let filtered =
      mode === 'results'
        ? data.filter((event) => event && isFinished(event.status))
        : data.filter((event) => event && !isFinished(event.status));

    // B. Filtro por Liga o Deporte
    const leagueId = selectedLeague
      ? COMPETITIONS_ID_MAP[selectedLeague]
      : undefined;

    if (leagueId) {
      filtered = filtered.filter((event) => event.competitionid === leagueId);
    } else if (selectedSport) {
      const sportIds = competitionIdsForSport(selectedSport);
      filtered = filtered.filter((event) => sportIds.has(event.competitionid));
    }

    // C. Filtro por Fechas (Solo modo resultados)
    if (mode === 'results' && (selectedFrom || selectedTo)) {
      filtered = filtered.filter((event) => {
        const eventDate = dayjs(event.kickoff);
        if (!eventDate.isValid()) return false;

        const isAfter = selectedFrom
          ? !eventDate.isBefore(dayjs(selectedFrom), 'day')
          : true;
        const isBefore = selectedTo
          ? !eventDate.isAfter(dayjs(selectedTo), 'day')
          : true;

        return isAfter && isBefore;
      });
    }

    // D. Slice si no es vista completa
    return full ? filtered : filtered.slice(0, 6);
  }, [
    data,
    mode,
    selectedSport,
    selectedLeague,
    selectedFrom,
    selectedTo,
    full,
  ]);

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
