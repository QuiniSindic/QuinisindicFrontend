'use client';

import { EventFilters, EventStatusFilter } from '@/types/domain/filters';
import {
  LeagueName,
  SportName,
  getSportIdByName,
  getSportNameByLeagueName,
  getSportSlugByName,
} from '@/utils/domain/sports';
import { buildEventSearchParams } from '@/utils/domain/filterParams';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useCallback } from 'react';

const buildNextFilters = (
  current: EventFilters,
  patch: Partial<EventFilters>,
): EventFilters => {
  const merged = {
    ...current,
    ...patch,
  };

  return {
    ...merged,
    sportSlug: getSportSlugByName(merged.sport),
    sportId: getSportIdByName(merged.sport),
  };
};

export const useEventFiltersNavigation = (filters: EventFilters) => {
  const router = useRouter();
  const pathname = usePathname();

  const replaceFilters = useCallback(
    (patch: Partial<EventFilters>) => {
      const nextFilters = buildNextFilters(filters, patch);
      const query = buildEventSearchParams(nextFilters).toString();
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [filters, pathname, router],
  );

  const setSelectedSport = useCallback(
    (sport: SportName | null) => {
      if (!sport || filters.sport === sport) {
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
        sport,
        selectedLeague: null,
        competitionId: null,
      });
    },
    [filters.sport, replaceFilters],
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

      const inferredSport = getSportNameByLeagueName(league) ?? filters.sport;

      replaceFilters({
        sport: inferredSport,
        selectedLeague: league,
        competitionId:
          typeof competitionId === 'number' && competitionId > 0
            ? competitionId
            : null,
      });
    },
    [filters.sport, replaceFilters],
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
