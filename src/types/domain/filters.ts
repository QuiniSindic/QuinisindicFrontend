import { SportName } from '@/utils/domain/sports';

export type EventPageMode = 'events' | 'results';
export type EventStatusFilter = 'all' | 'live' | 'upcoming';

export interface EventFilters {
  mode: EventPageMode;
  sport: SportName | null;
  sportSlug: string | null;
  sportId: number | null;
  selectedLeague: string | null;
  competitionId: number | null;
  from: string | null;
  to: string | null;
  status: EventStatusFilter;
}

export type LeaderboardScope = 'global' | 'sport' | 'competition';

export interface LeaderboardFiltersState {
  scope: LeaderboardScope;
  filterId: number | null;
}

export type PredictionsView = 'mine' | 'community';
export type PredictionsStatusFilter = 'all' | 'live' | 'ns' | 'finished';
export type PredictionsSortMode = 'status' | 'kickoff_desc' | 'kickoff_asc';

export interface PredictionsFiltersState {
  view: PredictionsView;
  status: PredictionsStatusFilter;
  sort: PredictionsSortMode;
}
