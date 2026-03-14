'use client';

import {
  LeaderboardEntry,
  LeaderboardFilterOption,
} from '@/services/server/pageData.service';
import {
  LeaderboardFiltersState,
  LeaderboardScope,
} from '@/types/domain/filters';
import { buildLeaderboardSearchParams } from '@/utils/domain/filterParams';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useMemo } from 'react';
import { LeaderboardFilters } from './LeaderboardFilters';
import { LeaderboardList } from './LeaderboardList';

interface LeaderboardPageClientProps {
  filters: LeaderboardFiltersState;
  data: LeaderboardEntry[];
  sportOptions: LeaderboardFilterOption[];
  competitionOptions: LeaderboardFilterOption[];
}

export function LeaderboardPageClient({
  filters,
  data,
  sportOptions,
  competitionOptions,
}: LeaderboardPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const items = useMemo(
    () => (filters.scope === 'sport' ? sportOptions : competitionOptions),
    [competitionOptions, filters.scope, sportOptions],
  );

  const replaceFilters = (next: LeaderboardFiltersState) => {
    const query = buildLeaderboardSearchParams(next).toString();
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  const handleScopeChange = (scope: LeaderboardScope) => {
    const firstOption =
      scope === 'sport'
        ? (sportOptions[0]?.id ?? null)
        : scope === 'competition'
          ? (competitionOptions[0]?.id ?? null)
          : null;

    replaceFilters({
      scope,
      filterId: scope === 'global' ? null : firstOption,
    });
  };

  const handleFilterChange = (filterId: number | null) => {
    replaceFilters({ ...filters, filterId });
  };

  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-text">Ranking</h1>
            <p className="text-gray-500">
              Consulta los mejores pronosticadores de la comunidad.
            </p>
          </div>

          <LeaderboardFilters
            currentScope={filters.scope}
            currentFilterId={filters.filterId}
            items={items}
            onScopeChange={handleScopeChange}
            onFilterChange={handleFilterChange}
          />

          <main>
            <LeaderboardList data={data} />
          </main>
        </div>
      </div>
    </div>
  );
}
