export enum MatchEventType {
  Goal = 'Goal',
  Card = 'Card',
  Substitution = 'Substitution',
  Half = 'Half',
  AddedTime = 'AddedTime',
  MissedPenalty = 'MissedPenalty',
  PenaltyGoal = 'PenaltyGoal',
  FailedPenalty = 'FailedPenalty',
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  [MatchEventType.Goal]: 'Gol',
  [MatchEventType.Card]: 'Tarjeta',
  [MatchEventType.Substitution]: 'Cambio',
  [MatchEventType.Half]: 'Parte',
  [MatchEventType.MissedPenalty]: 'Penalti fallado',
  [MatchEventType.PenaltyGoal]: 'Gol de penalti',
  [MatchEventType.AddedTime]: 'Tiempo añadido',
};
export type MatchEventKind =
  | 'goal'
  | 'missed_penalty'
  | 'card'
  | 'substitution'
  | 'added_time'
  | 'period'
  | 'var'
  | 'other';

export type MatchEventSide = 'home' | 'away' | 'neutral';

export interface MatchEvent {
  type: MatchEventType | string; // Flexible para strings
  minute: number;
  timeStr?: string | number; // Ej: "45+2"
  isHome: boolean | null;
  kind?: MatchEventKind;
  side?: MatchEventSide;
  title?: string;
  subtitle?: string;
  detail?: string;
  isCancelled?: boolean;

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

  cardType?: 'Yellow' | 'Red' | 'YellowRed'; // Tarjeta

  playerIn?: string; // Cambio
  playerOut?: string; // Cambio
  playerInId?: number;
  playerOutId?: number;

  label?: string; // "HT", "FT" para eventos tipo Half
}

export type TeamInfo = {
  id: number;
  name: string;
  abbr: string;
  img: string | null;
  country: string;
};
export interface MatchData {
  id: number;
  status: MatchStatus;
  result: string;
  kickoff: string; // 21:00 01/06/2025
  kickoffIso?: string | null;
  events?: MatchEvent[];
  homeId: number;
  awayId: number;
  competitionid: number;
  sportId: number;
  minute?: string;
  round?: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  country: string;
  Odds?: Odds;
}

export type MatchLite = {
  id: number;
  kickoff: string;
  kickoffIso?: string | null;
  status: string;
  minute?: string | null;
  home_team_data?: TeamInfo | null;
  away_team_data?: TeamInfo | null;
  home_score?: number | null;
  away_score?: number | null;
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
  'LIVE',
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

export const FINISHED_MATCH_STATUSES = ['FT', 'AET', 'AP', 'Pen'] as const;
export const NOT_STARTED_STATUSES = new Set(['NS']);
export const FINAL_STATUSES = new Set(['FT', 'AET', 'AP', 'Pen', 'Canc.']);

export type MatchStatus = (typeof MATCH_STATUSES)[number];

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
