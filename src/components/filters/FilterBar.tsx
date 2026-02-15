'use client';

import { useCompetitionOptions } from '@/hooks/useCompetitionOptions';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import {
  SPORT_ID_MAP,
  SPORTS_LIST_ITEMS,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import { useMemo } from 'react';
import { DateFilter } from './date/DateFilter';
import { LeaguesFilter } from './LeagueFilter';
import { SportsFilter } from './SportsFilter';

interface FilterBarProps {
  mode: 'events' | 'results';
}

export default function FilterBar({ mode }: FilterBarProps) {
  const {
    selectedSport,
    setSelectedSport,
    selectedLeague,
    selectedCompetitionId,
    setSelectedLeague,
  } = useSportsFilter();

  const sportSlug = selectedSport ? SPORTS_MAP[selectedSport] : undefined;
  const sportId = sportSlug ? SPORT_ID_MAP[sportSlug] : undefined;

  const { data: competitions = [] } = useCompetitionOptions(sportId);

  const { staticLeagues, dynamicLeagueOptions } = useMemo(() => {
    if (competitions.length > 0) {
      return { staticLeagues: [], dynamicLeagueOptions: competitions };
    }

    return {
      staticLeagues:
        SPORTS_LIST_ITEMS.find((sport) => sport.name === selectedSport)
          ?.leagues || [],
      dynamicLeagueOptions: [],
    };
  }, [competitions, selectedSport]);

  const hasLeagues =
    selectedSport &&
    (staticLeagues.length > 0 || dynamicLeagueOptions.length > 0);

  return (
    <div className="flex flex-col w-full">
      <SportsFilter selectedSport={selectedSport} onSelect={setSelectedSport} />

      <div
        className={`
        mt-3 flex flex-col
        ${mode === 'results' && hasLeagues ? 'gap-3' : ''}
        lg:flex-row lg:items-start 
        ${hasLeagues ? 'lg:justify-between' : 'lg:justify-start'}
        ${mode === 'results' && hasLeagues ? 'lg:gap-3' : ''} 
      `}
      >
        {hasLeagues && (
          <div className="w-full min-w-0 order-1">
            {/* order-1 asegura que va primero */}
            <LeaguesFilter
              leagues={staticLeagues}
              leagueOptions={dynamicLeagueOptions}
              selectedLeague={selectedLeague}
              selectedCompetitionId={selectedCompetitionId}
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
