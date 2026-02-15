'use client';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { createClient } from '@/utils/supabase/client';
import { normalizeCountryLabel } from '@/utils/domain/country';
import {
  LeagueName,
  SPORT_ID_MAP,
  SportName,
  SPORTS_MAP,
} from '@/utils/domain/sports';
import { useQuery } from '@tanstack/react-query';
import { LeagueFilterOption } from '../../filters/LeagueFilter';
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

  const { data: leagueOptions = [] } = useQuery({
    queryKey: ['sports-list-competitions', sportId],
    enabled: !!sportId,
    queryFn: async (): Promise<LeagueFilterOption[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('competitions')
        .select('id, name, country')
        .eq('sport_id', sportId!)
        .order('country', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return (data || []).map((competition) => ({
        id: competition.id,
        name: competition.name,
        country: normalizeCountryLabel(competition.country),
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

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
