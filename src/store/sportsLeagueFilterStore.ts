import { create } from 'zustand';
import { SPORTS_LIST_ITEMS } from '../utils/sports.utils';

interface SportsFilter {
  selectedSport: string | null;
  selectedLeague: string | null;
  setSelectedSport: (sport: string | null) => void;
  setSelectedLeague: (league: string | null) => void;

  selectedFrom?: string | null;
  selectedTo?: string | null;
  setSelectedFrom: (d?: string | null) => void;
  setSelectedTo: (d?: string | null) => void;

  clearDates: () => void;
}

export const useSportsFilter = create<SportsFilter>((set) => ({
  selectedSport: null,
  selectedLeague: null,
  setSelectedSport: (sport) =>
    set((state) => {
      // Si el deporte ya está seleccionado, se hace toggle a null
      if (state.selectedSport === sport) {
        return { selectedSport: null, selectedLeague: null };
      }
      // Si se selecciona un deporte diferente, se guarda el nuevo deporte y se resetea la liga
      return { selectedSport: sport, selectedLeague: null };
    }),
  setSelectedLeague: (league) =>
    set((state) => {
      // Si la liga ya está seleccionada, se hace toggle a null
      if (state.selectedLeague === league) {
        return { selectedLeague: null, selectedSport: null };
      }
      // Si se selecciona una liga diferente, se busca el deporte correspondiente
      const foundSport = SPORTS_LIST_ITEMS.find(
        (sport) => league !== null && sport.leagues.includes(league),
      )?.name;
      return {
        selectedSport: foundSport || state.selectedSport,
        selectedLeague: league,
      };
    }),

  selectedFrom: null,
  selectedTo: null,
  setSelectedFrom: (d) => set({ selectedFrom: d }),
  setSelectedTo: (d) => set({ selectedTo: d }),
  clearDates: () => set({ selectedFrom: null, selectedTo: null }),
}));
