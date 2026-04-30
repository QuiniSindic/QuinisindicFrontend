import { EventFilters } from '@/types/domain/filters';
import { MatchData } from '@/types/domain/events';
import { getTimestamp, parseDateTime } from '@/utils/common/date';
import { isFinished, isLive } from '@/utils/domain/events';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface UseFilteredMatchesProps {
  data: MatchData[];
  filters: EventFilters;
  full: boolean;
}

export function useLocalEventFilters({
  data,
  filters,
  full,
}: UseFilteredMatchesProps) {
  return useMemo(() => {
    if (!data) return [];

    let filtered =
      filters.mode === 'results'
        ? data.filter((event) => event && isFinished(event.status))
        : data.filter((event) => event && !isFinished(event.status));

    if (filters.mode === 'events' && filters.status !== 'all') {
      filtered = filtered.filter((event) => {
        const live = isLive(event.status);
        return filters.status === 'live' ? live : !live;
      });
    }

    if (filters.competitionId) {
      filtered = filtered.filter(
        (event) => event.competitionid === filters.competitionId,
      );
    } else if (filters.sportId) {
      filtered = filtered.filter((event) => event.sportId === filters.sportId);
    }

    if (filters.mode === 'results' && (filters.from || filters.to)) {
      filtered = filtered.filter((event) => {
        const eventDate = parseDateTime(event.kickoffIso ?? event.kickoff);
        if (!eventDate) return false;

        const isAfter = filters.from
          ? !eventDate.isBefore(dayjs(filters.from), 'day')
          : true;
        const isBefore = filters.to
          ? !eventDate.isAfter(dayjs(filters.to), 'day')
          : true;

        return isAfter && isBefore;
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const aLive = isLive(a.status);
      const bLive = isLive(b.status);

      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      const aTimestamp = getTimestamp(a.kickoffIso ?? a.kickoff);
      const bTimestamp = getTimestamp(b.kickoffIso ?? b.kickoff);

      return filters.mode === 'results'
        ? bTimestamp - aTimestamp
        : aTimestamp - bTimestamp;
    });

    return full ? sorted : sorted.slice(0, 6);
  }, [data, filters, full]);
}
