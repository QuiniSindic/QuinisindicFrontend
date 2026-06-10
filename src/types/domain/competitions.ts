import type { MatchData } from './events';
import type { TeamStandingData } from './standings';

export interface CompetitionEditionLite {
  id: number;
  season_key: string;
  season_label: string;
  is_current: boolean;
}

export type CompetitionFormatKind =
  | 'league'
  | 'knockout'
  | 'groups_knockout'
  | 'league_phase_knockout'
  | 'unknown';

export type CompetitionStageType =
  | 'league_table'
  | 'group'
  | 'knockout_round'
  | 'session';

export interface StageGroup {
  id: string;
  name: string;
  order: number;
  standings?: TeamStandingData[];
  matches?: MatchData[];
}

export interface CompetitionStage {
  id: string;
  name: string;
  stageType: CompetitionStageType;
  order: number;
  roundLabels?: string[];
  groups?: StageGroup[];
  matches?: MatchData[];
}

export interface CompetitionData {
  id: string;
  name: string;
  fullName: string;
  badge: string;
  country?: string;
  formatKind?: CompetitionFormatKind;
  edition?: CompetitionEditionLite | null;
  stages?: CompetitionStage[];
  matches: MatchData[];
}

export interface CompetitionStructure {
  competitionId: number;
  name: string;
  badge: string;
  country?: string;
  formatKind: CompetitionFormatKind;
  edition?: CompetitionEditionLite | null;
  stages: CompetitionStage[];
}

export interface CompetitionOption {
  id: number;
  name: string;
  country?: string;
  current_edition?: CompetitionEditionLite | null;
}

export type CompetitionLite = {
  id: number;
  name: string;
};
