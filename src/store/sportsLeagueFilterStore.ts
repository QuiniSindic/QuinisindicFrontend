import {
  getCompetitionIdByLeagueName,
  LeagueName,
  SportName,
  SPORTS_LIST_ITEMS,
} from '@/utils/domain/sports';
import { create } from 'zustand';

export type EventListStatusFilter = 'all' | 'live' | 'upcoming';

interface SportsFilter {
  selectedSport: SportName | null;
  setSelectedSport: (sport: SportName | null) => void;

  selectedLeague: LeagueName | null;
  selectedCompetitionId: number | null;
  setSelectedLeague: (league: LeagueName | null, leagueId?: number) => void;

  selectedFrom?: string | null;
  setSelectedFrom: (d?: string | null) => void;

  selectedTo?: string | null;
  setSelectedTo: (d?: string | null) => void;

  statusFilter: EventListStatusFilter;
  setStatusFilter: (filter: EventListStatusFilter) => void;

  clearDates: () => void;
}

export const useSportsFilter = create<SportsFilter>((set) => ({
  selectedSport: null,
  setSelectedSport: (sport) =>
    set((state) => {
      if (state.selectedSport === sport) {
        return {
          selectedSport: null,
          selectedLeague: null,
          selectedCompetitionId: null,
        };
      }

      return {
        selectedSport: sport,
        selectedLeague: null,
        selectedCompetitionId: null,
      };
    }),

  selectedLeague: null,
  selectedCompetitionId: null,
  setSelectedLeague: (league, leagueId) =>
    set((state) => {
      if (state.selectedLeague === league) {
        return {
          selectedLeague: null,
          selectedSport: null,
          selectedCompetitionId: null,
        };
      }

      const foundSport = SPORTS_LIST_ITEMS.find(
        (sport) =>
          league !== null &&
          (sport.leagues as readonly string[]).includes(league),
      )?.name;

      const resolvedCompetitionId =
        typeof leagueId === 'number' && leagueId > 0
          ? leagueId
          : getCompetitionIdByLeagueName(league);

      return {
        selectedSport: foundSport || state.selectedSport,
        selectedLeague: league,
        selectedCompetitionId: resolvedCompetitionId || null,
      };
    }),

  selectedFrom: null,
  setSelectedFrom: (date) => set({ selectedFrom: date }),

  selectedTo: null,
  setSelectedTo: (date) => set({ selectedTo: date }),

  statusFilter: 'all',
  setStatusFilter: (status) =>
    set((state) => ({
      statusFilter: state.statusFilter === status ? 'all' : status,
    })),

  clearDates: () => set({ selectedFrom: null, selectedTo: null }),
}));
