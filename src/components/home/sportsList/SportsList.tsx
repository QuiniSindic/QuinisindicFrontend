'use client';

import { useCompetitionOptions } from '@/hooks/useCompetitionOptions';
import { useEventFiltersNavigation } from '@/hooks/useEventFiltersNavigation';
import { useSportsOptions } from '@/hooks/useSportsOptions';
import { CompetitionOption } from '@/types/domain/competitions';
import { EventFilters } from '@/types/domain/filters';
import { SportOption } from '@/types/domain/sports';
import { LeagueName } from '@/utils/domain/sports';
import { SportsListDesktop } from './SportsListDesktop';
import { SportsListMobile } from './SportsListMobile';

interface SportsListProps {
  filters: EventFilters;
  initialCompetitionOptions?: CompetitionOption[];
  initialSportsOptions?: SportOption[];
}

export function SportsList({
  filters,
  initialCompetitionOptions,
  initialSportsOptions,
}: SportsListProps) {
  const { setSelectedSport, setSelectedLeague } =
    useEventFiltersNavigation(filters);
  const { data: leagueOptions = [] } = useCompetitionOptions(
    filters.sportId ?? undefined,
    initialCompetitionOptions,
  );
  const { data: sports = [] } = useSportsOptions(initialSportsOptions);

  const handleLeagueSelect = (league: LeagueName | null, leagueId?: number) => {
    setSelectedLeague(league, leagueId);
  };

  const toggleSport = (sport: SportOption) => {
    setSelectedSport(sport);
  };

  return (
    <>
      {/* Versión para pantallas pequeñas (mobile) */}
      <SportsListMobile
        sports={sports}
        selectedSport={filters.sport}
        selectedLeague={filters.selectedLeague}
        selectedCompetitionId={filters.competitionId}
        leagueOptions={leagueOptions}
        toggleSport={toggleSport}
        handleLeagueSelect={handleLeagueSelect}
      />

      {/* Versión para pantallas grandes (desktop) */}
      <SportsListDesktop
        sports={sports}
        selectedSport={filters.sport}
        selectedLeague={filters.selectedLeague}
        selectedCompetitionId={filters.competitionId}
        leagueOptions={leagueOptions}
        toggleSport={toggleSport}
        handleLeagueSelect={handleLeagueSelect}
      />
    </>
  );
}
