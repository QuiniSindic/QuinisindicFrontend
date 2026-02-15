'use client';

import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { createClient } from '@/utils/supabase/client';
import { normalizeCountryLabel } from '@/utils/domain/country';
import { SPORT_ID_MAP, SPORTS_MAP } from '@/utils/domain/sports';
import { SPORTS_LIST_ITEMS } from '@/utils/domain/sports';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { DateFilter } from './date/DateFilter';
import { LeagueFilterOption, LeaguesFilter } from './LeagueFilter';
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

  const { data: competitions = [] } = useQuery({
    queryKey: ['filter-competitions', sportId],
    enabled: !!sportId,
    queryFn: async (): Promise<LeagueFilterOption[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('competitions')
        .select('id, name, country')
        .eq('sport_id', sportId!)
        .order('country', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map((competition) => ({
        id: competition.id,
        name: competition.name,
        country: normalizeCountryLabel(competition.country),
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

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
        lg:flex-row lg:items-start 
        ${hasLeagues ? 'lg:justify-between' : 'lg:justify-start'} 
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
