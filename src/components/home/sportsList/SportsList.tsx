'use client';
import { useCompetitionOptions } from '@/hooks/useCompetitionOptions';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import {
  LeagueName,
  SPORT_ID_MAP,
  SportName,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import { SportsListDesktop } from './SportsListDesktop';
import { SportsListMobile } from './SportsListMobile';

export default function SportsList() {
  const {
    selectedSport,
    setSelectedSport,
    selectedLeague,
    selectedCompetitionId,
    setSelectedLeague,
  } = useSportsFilter();

  const sportSlug = selectedSport ? SPORTS_MAP[selectedSport] : undefined;
  const sportId = sportSlug ? SPORT_ID_MAP[sportSlug] : undefined;

  const { data: leagueOptions = [] } = useCompetitionOptions(sportId);

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
        selectedSport={selectedSport}
        selectedLeague={selectedLeague}
        selectedCompetitionId={selectedCompetitionId}
        leagueOptions={leagueOptions}
        toggleSport={toggleSport}
        handleLeagueSelect={handleLeagueSelect}
      />

      {/* Versión para pantallas grandes (desktop) */}
      <SportsListDesktop
        selectedSport={selectedSport}
        selectedLeague={selectedLeague}
        selectedCompetitionId={selectedCompetitionId}
        leagueOptions={leagueOptions}
        toggleSport={toggleSport}
        handleLeagueSelect={handleLeagueSelect}
      />
    </>
  );
}
