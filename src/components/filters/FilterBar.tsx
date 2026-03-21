'use client';

import { useCompetitionOptions } from '@/hooks/useCompetitionOptions';
import { useEventFiltersNavigation } from '@/hooks/useEventFiltersNavigation';
import { useSportsOptions } from '@/hooks/useSportsOptions';
import { CompetitionOption } from '@/types/domain/competitions';
import { EventFilters } from '@/types/domain/filters';
import { SportOption } from '@/types/domain/sports';
import { DateFilter } from './date/DateFilter';
import { LeaguesFilter } from './LeagueFilter';
import { SportsFilter } from './SportsFilter';

interface FilterBarProps {
  filters: EventFilters;
  initialCompetitionOptions?: CompetitionOption[];
  initialSportsOptions?: SportOption[];
}

export function FilterBar({
  filters,
  initialCompetitionOptions,
  initialSportsOptions,
}: FilterBarProps) {
  const {
    setSelectedSport,
    setSelectedLeague,
    setSelectedFrom,
    setSelectedTo,
    clearDates,
  } = useEventFiltersNavigation(filters);
  const { data: competitions = [] } = useCompetitionOptions(
    filters.sportId ?? undefined,
    initialCompetitionOptions,
  );
  const { data: sports = [] } = useSportsOptions(initialSportsOptions);

  const hasLeagues = competitions.length > 0;

  return (
    <div className="flex flex-col w-full">
      <SportsFilter
        sports={sports}
        selectedSport={filters.sport}
        onSelect={setSelectedSport}
      />

      <div
        className={`
        mt-3 flex flex-col
        ${filters.mode === 'results' && hasLeagues ? 'gap-3' : ''}
        lg:flex-row lg:items-start
        ${hasLeagues ? 'lg:justify-between' : 'lg:justify-start'}
        ${filters.mode === 'results' && hasLeagues ? 'lg:gap-3' : ''}
      `}
      >
        {hasLeagues && (
          <div className="w-full min-w-0 order-1">
            <LeaguesFilter
              leagues={[]}
              leagueOptions={competitions}
              selectedLeague={filters.selectedLeague}
              selectedCompetitionId={filters.competitionId}
              onSelect={setSelectedLeague}
            />
          </div>
        )}

        {filters.mode === 'results' && (
          <div className="w-full lg:w-auto order-2">
            <DateFilter
              selectedFrom={filters.from}
              selectedTo={filters.to}
              clearDates={clearDates}
              setSelectedFrom={setSelectedFrom}
              setSelectedTo={setSelectedTo}
              selectedSport={filters.sport}
              selectedLeague={filters.selectedLeague}
            />
          </div>
        )}
      </div>
    </div>
  );
}
