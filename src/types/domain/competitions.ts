import { MatchData } from './events';

export interface CompetitionData {
  id: string;
  name: string;
  fullName: string;
  badge: string;
  country?: string;
  matches: MatchData[];
}

export type CompetitionLite = {
  id: number;
  name: string;
};
