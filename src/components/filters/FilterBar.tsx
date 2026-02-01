'use client';

import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { SPORTS_LIST_ITEMS } from '@/utils/sports.utils';
import { useMemo } from 'react';
import { DateFilter } from './date/DateFilter';
import { LeaguesFilter } from './LeagueFilter';
import { SportsFilter } from './SportsFilter';

interface FilterBarProps {
  mode: 'events' | 'results';
}

export default function FilterBar({ mode }: FilterBarProps) {
  const { selectedSport, setSelectedSport, selectedLeague, setSelectedLeague } =
    useSportsFilter();

  const availableLeagues = useMemo(
    () =>
      SPORTS_LIST_ITEMS.find((sport) => sport.name === selectedSport)
        ?.leagues || [],
    [selectedSport],
  );

  const hasLeagues = selectedSport && availableLeagues.length > 0;

  return (
    <div className="flex flex-col w-full">
      <SportsFilter selectedSport={selectedSport} onSelect={setSelectedSport} />

      <div
        className={`
        flex flex-col
        lg:flex-row lg:items-start 
        ${hasLeagues ? 'lg:justify-between' : 'lg:justify-start'} 
      `}
      >
        {hasLeagues && (
          <div className="w-full min-w-0 order-1">
            {/* order-1 asegura que va primero */}
            <LeaguesFilter
              leagues={availableLeagues}
              selectedLeague={selectedLeague}
              onSelect={setSelectedLeague}
            />
          </div>
        )}

        {mode === 'results' && (
          <div className="w-full lg:w-auto order-2">
            <DateFilter />
          </div>
        )}
      </div>
    </div>
  );
}
