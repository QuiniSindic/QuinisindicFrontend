import { MatchData } from '@/types/events/events.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MatchesStore {
  events: MatchData[];
  setEvents: (events: MatchData[]) => void;
}

export const useMatchesStore = create<MatchesStore>()(
  persist(
    (set) => ({
      events: [],
      setEvents: (events) => set({ events }),
    }),
    {
      name: 'next-matches',
    },
  ),
);
