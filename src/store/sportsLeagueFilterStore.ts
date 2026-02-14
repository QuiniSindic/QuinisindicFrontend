import {
  LeagueName,
  SportName,
  SPORTS_LIST_ITEMS,
} from '@/utils/domain/sports';
import { create } from 'zustand';

export type MatchStatusFilter = 'all' | 'live' | 'upcoming';

interface SportsFilter {
  selectedSport: SportName | null;
  setSelectedSport: (sport: SportName | null) => void;

  selectedLeague: LeagueName | null;
  setSelectedLeague: (league: LeagueName | null) => void;

  selectedFrom?: string | null;
  setSelectedFrom: (d?: string | null) => void;

  selectedTo?: string | null;
  setSelectedTo: (d?: string | null) => void;

  statusFilter: MatchStatusFilter;
  setStatusFilter: (filter: MatchStatusFilter) => void;

  clearDates: () => void;
}

export const useSportsFilter = create<SportsFilter>((set) => ({
  selectedSport: null,
  setSelectedSport: (sport) =>
    set((state) => {
      // Si el deporte ya está seleccionado, se hace toggle a null
      if (state.selectedSport === sport) {
        return { selectedSport: null, selectedLeague: null };
      }
      // Si se selecciona un deporte diferente, se guarda el nuevo deporte y se resetea la liga
      return { selectedSport: sport, selectedLeague: null };
    }),

  selectedLeague: null,
  setSelectedLeague: (league) =>
    set((state) => {
      // Si la liga ya está seleccionada, se hace toggle a null
      if (state.selectedLeague === league) {
        return { selectedLeague: null, selectedSport: null };
      }
      // Si se selecciona una liga diferente, se busca el deporte correspondiente
      const foundSport = SPORTS_LIST_ITEMS.find(
        (sport) =>
          league !== null &&
          (sport.leagues as readonly string[]).includes(league),
      )?.name;
      return {
        selectedSport: foundSport || state.selectedSport,
        selectedLeague: league,
      };
    }),

  selectedFrom: null,
  setSelectedFrom: (date) => set({ selectedFrom: date }),

  selectedTo: null,
  setSelectedTo: (date) => set({ selectedTo: date }),

  statusFilter: 'all',
  setStatusFilter: (status) =>
    set((state) => ({
      // Si el status que llega es igual al que ya está, volvemos a 'all' (desmarcar)
      statusFilter: state.statusFilter === status ? 'all' : status,
    })),

  clearDates: () => set({ selectedFrom: null, selectedTo: null }),
}));
