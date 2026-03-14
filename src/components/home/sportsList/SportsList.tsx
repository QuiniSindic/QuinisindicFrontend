'use client';

import { useCompetitionOptions } from '@/hooks/useCompetitionOptions';
import { useEventFiltersNavigation } from '@/hooks/useEventFiltersNavigation';
import { CompetitionOption } from '@/types/domain/competitions';
import { EventFilters } from '@/types/domain/filters';
import { LeagueName, SportName } from '@/utils/domain/sports';
import { SportsListDesktop } from './SportsListDesktop';
import { SportsListMobile } from './SportsListMobile';

interface SportsListProps {
  filters: EventFilters;
  initialCompetitionOptions?: CompetitionOption[];
}

export function SportsList({
  filters,
  initialCompetitionOptions,
}: SportsListProps) {
  const { setSelectedSport, setSelectedLeague } =
    useEventFiltersNavigation(filters);
  const { data: leagueOptions = [] } = useCompetitionOptions(
    filters.sportId ?? undefined,
    initialCompetitionOptions,
  );

  const handleLeagueSelect = (league: LeagueName | null, leagueId?: number) => {
    setSelectedLeague(league, leagueId);
  };

  const toggleSport = (sport: SportName) => {
    setSelectedSport(sport);
  };

  return (
    <>
      {/* Versión para pantallas pequeñas (mobile) */}
      <SportsListMobile
        selectedSport={filters.sport}
        selectedLeague={filters.selectedLeague}
        selectedCompetitionId={filters.competitionId}
        leagueOptions={leagueOptions}
        toggleSport={toggleSport}
        handleLeagueSelect={handleLeagueSelect}
      />

      {/* Versión para pantallas grandes (desktop) */}
      <SportsListDesktop
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
