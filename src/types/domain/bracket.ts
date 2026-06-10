import { TeamInfo } from './events';

export interface BracketLegData {
  eventId: number;
  kickoff: string;
  kickoffIso?: string | null;
  status: string;
  minute?: string | null;
  result: string;
  leg: number;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

export interface BracketTieData {
  id: string;
  roundId: string;
  roundName: string;
  order: number;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  aggregateHomeScore?: number | null;
  aggregateAwayScore?: number | null;
  winnerParticipantId?: number | null;
  isTwoLegged: boolean;
  legs: BracketLegData[];
}

export interface BracketRoundData {
  id: string;
  name: string;
  order: number;
  ties: BracketTieData[];
}
