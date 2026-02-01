export enum MatchEventType {
  Goal = 'Goal',
  Card = 'Card',
  Substitution = 'Substitution',
  Half = 'Half',
  AddedTime = 'AddedTime',
  // Dejamos estos por si acaso, pero el back manda los de arriba
  PenaltyGoal = 'PenaltyGoal',
  FailedPenalty = 'FailedPenalty',
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  [MatchEventType.Goal]: 'Gol',
  [MatchEventType.Card]: 'Tarjeta',
  [MatchEventType.Substitution]: 'Cambio',
  [MatchEventType.Half]: 'Parte',
  [MatchEventType.AddedTime]: 'Tiempo añadido',
};
export interface MatchEvent {
  type: MatchEventType | string; // Flexible para strings
  minute: number;
  timeStr?: string | number; // Ej: "45+2"
  isHome: boolean | null;

  score?: {
    home: number;
    away: number;
  };

  isPenaltyShootout?: boolean;

  // Campos específicos según tipo
  player?: string; // Gol o Tarjeta
  playerId?: number;
  assist?: string; // Gol
  ownGoal?: boolean | null; // Gol
  isPenalty?: boolean; // Gol

  cardType?: 'Yellow' | 'Red'; // Tarjeta

  playerIn?: string; // Cambio
  playerOut?: string; // Cambio
  playerInId?: number;
  playerOutId?: number;

  label?: string; // "HT", "FT" para eventos tipo Half
}

export interface MatchData {
  id: number;
  status: MatchStatus;
  result: string;
  kickoff: string; // 21:00 01/06/2025
  events?: MatchEvent[];
  homeId: number;
  awayId: number;
  competitionid: number;
  minute?: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  country: string;
  Odds?: Odds;
}

export type TeamInfo = {
  id: number;
  name: string;
  abbr: string;
  img: string | null;
  country: string;
};

export interface MatchFullData extends MatchData {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

export interface Odds {
  id: string;
  matchId: number;
  homeOdd: number;
  awayOdd: number;
  drawOdd: number;
}

export const MATCH_STATUSES = [
  'NS', // Not Started
  'HT', // Half Time
  'FT', // Full Time
  'OT', // Overtime no se si existe
  'AET', // After Extra Time
  'AP', // After Penalties
  'Canc.', // Cancelled
  '1H',
  '2H',
  'Susp.',
  'Pen',
] as const;

export const FINAL_STATUSES: MatchStatus[] = ['FT', 'AET', 'AP', 'Canc.'];
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export interface CompetitionData {
  id: string;
  name: string;
  fullName: string;
  badge: string;
  matches: MatchData[];
}

export type ParsedMinute = {
  min: number;
  extra: number;
  total: number;
  label: string;
};

export interface EventsSportsResponse {
  football: {
    matches: MatchFullData[] | [];
  };
  basketball: {
    matches: MatchFullData[];
  };
  tennis: {
    matches: MatchFullData[];
  };
  motor: {
    matches: MatchFullData[];
  };
}

export interface ActionGroups {
  firstHalf: MatchEvent[];
  secondHalf: MatchEvent[];
  breaks: MatchEvent[];
  finals: MatchEvent[];
  overtime: MatchEvent[];
  penalties: MatchEvent[]; // tanda de penaltis
}

export type FormValues = { home: string; away: string };
