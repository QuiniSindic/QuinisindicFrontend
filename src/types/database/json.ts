import type { MatchEvent, TeamInfo } from '@/types/domain/events';
import type { TeamStandingData } from '@/types/domain/standings';

export type DbTeamInfoJson = TeamInfo;
export type DbMatchEventJson = MatchEvent;

export interface DbStandingRowJson {
  id: string;
  position: number;
  name: string;
  badge: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  form: TeamStandingData['form'];
}
