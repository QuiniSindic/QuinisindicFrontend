import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { MatchData } from '@/types/events/events.types';
import {
  competitionIdsForSport,
  isFinished,
  isLive,
} from '@/utils/events.utils';

import { COMPETITIONS_ID_MAP } from '@/utils/sports.utils';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface UseFilteredMatchesProps {
  data: MatchData[];
  mode: 'events' | 'results';
  full: boolean;
}

export function useLocalEventFilters({
  data,
  mode,
  full,
}: UseFilteredMatchesProps) {
  const {
    selectedSport,
    selectedLeague,
    selectedFrom,
    selectedTo,
    statusFilter,
  } = useSportsFilter();

  return useMemo(() => {
    if (!data) return [];

    // 1. Filtrado por estado (Finalizados vs Próximos)
    let filtered =
      mode === 'results'
        ? data.filter((e) => e && isFinished(e.status))
        : data.filter((e) => e && !isFinished(e.status));

    // 2. Filtro por "Estado de Juego" (Live / Upcoming) - Solo en modo eventos
    if (mode === 'events' && statusFilter !== 'all') {
      filtered = filtered.filter((event) => {
        const live = isLive(event.status);
        return statusFilter === 'live' ? live : !live;
      });
    }

    // 3. Filtro por Liga o Deporte
    const leagueId = selectedLeague
      ? COMPETITIONS_ID_MAP[selectedLeague]
      : undefined;
    if (leagueId) {
      filtered = filtered.filter((e) => e.competitionId === leagueId);
    } else if (selectedSport) {
      const sportIds = competitionIdsForSport(selectedSport);
      filtered = filtered.filter((e) => sportIds.has(e.competitionId));
    }

    // 4. Filtro por Fechas (Modo resultados)
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

    // 5. Ordenación
    const sorted = [...filtered].sort((a, b) => {
      const aLive = isLive(a.status);
      const bLive = isLive(b.status);
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;
      return dayjs(a.kickoff).valueOf() - dayjs(b.kickoff).valueOf();
    });

    return full ? sorted : sorted.slice(0, 6);
  }, [
    data,
    mode,
    selectedSport,
    selectedLeague,
    selectedFrom,
    selectedTo,
    statusFilter,
    full,
  ]);
}
