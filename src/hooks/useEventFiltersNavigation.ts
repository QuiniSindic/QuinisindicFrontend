'use client';

import { EventFilters, EventStatusFilter } from '@/types/domain/filters';
import { SportOption } from '@/types/domain/sports';
import { LeagueName } from '@/utils/domain/sports';
import { buildEventSearchParams } from '@/utils/domain/filterParams';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useCallback } from 'react';

export const useEventFiltersNavigation = (filters: EventFilters) => {
  const router = useRouter();
  const pathname = usePathname();

  const replaceFilters = useCallback(
    (patch: Partial<EventFilters>) => {
      const nextFilters: EventFilters = {
        ...filters,
        ...patch,
      };
      const query = buildEventSearchParams(nextFilters).toString();
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [filters, pathname, router],
  );

  const setSelectedSport = useCallback(
    (sport: SportOption | null) => {
      if (!sport || filters.sportId === sport.id) {
        replaceFilters({
          sport: null,
          sportSlug: null,
          sportId: null,
          selectedLeague: null,
          competitionId: null,
        });
        return;
      }

      replaceFilters({
        sport: sport.displayName,
        sportSlug: sport.slug,
        sportId: sport.id,
        selectedLeague: null,
        competitionId: null,
      });
    },
    [filters.sportId, replaceFilters],
  );

  const setSelectedLeague = useCallback(
    (league: LeagueName | null, competitionId?: number) => {
      if (!league) {
        replaceFilters({
          selectedLeague: null,
          competitionId: null,
        });
        return;
      }

      replaceFilters({
        selectedLeague: league,
        competitionId:
          typeof competitionId === 'number' && competitionId > 0
            ? competitionId
            : null,
      });
    },
    [replaceFilters],
  );

  const setStatusFilter = useCallback(
    (status: EventStatusFilter) => {
      replaceFilters({
        status: filters.status === status ? 'all' : status,
      });
    },
    [filters.status, replaceFilters],
  );

  const setSelectedFrom = useCallback(
    (from?: string | null) => replaceFilters({ from: from || null }),
    [replaceFilters],
  );

  const setSelectedTo = useCallback(
    (to?: string | null) => replaceFilters({ to: to || null }),
    [replaceFilters],
  );

  const clearDates = useCallback(
    () =>
      replaceFilters({
        from: null,
        to: null,
      }),
    [replaceFilters],
  );

  return {
    setSelectedSport,
    setSelectedLeague,
    setStatusFilter,
    setSelectedFrom,
    setSelectedTo,
    clearDates,
  };
};
