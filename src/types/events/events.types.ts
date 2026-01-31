export enum MatchEventType {
  Goal = 36,
  FailedPenalty = 40,
  PenaltyGoal = 41,
  YellowCard = 43,
  // Segunda Amarilla y roja? = 44
  RedCard = 45,
  HalfTime = 46,
  FinalTime = 47,
  Overtime = 48,
  None,
  // TODO COMPROBAR ESTO SI ES CIERTO XD
  // Sustitución
  // jugador entrante
  // PlayerIn = 5,
  // jugador saliente
  // PlayerOut = 4,
}
// ejemplo de cambio
/**
 * {
				"Min": 66,
				"Nm": 2,
				"Sor": 1,
				"Incs": [
					{
						"Min": 66,
						"Nm": 2,
						"Aid": "91166",
						"ID": "91166",
						"Fn": "Emmanuel Ofori",
						"Ln": "Agyemang",
						"Pnt": "emmanuel-ofori-agyemang",
						"Pn": "Emmanuel Agyemang",
						"IDo": "1349",
						"AIDo": "1349",
						"IT": 5,
						"Sor": 1
					},
					{
						"Min": 66,
						"Nm": 2,
						"Aid": "1349",
						"ID": "1349",
						"Fn": "Simon",
						"Ln": "Piesinger",
						"Pnt": "simon-piesinger",
						"Pn": "Simon Piesinger",
						"IDo": "91166",
						"AIDo": "91166",
						"IT": 4,
						"Sor": 0
					}
 */

export const eventTypeLabels: Record<MatchEventType, string> = {
  [MatchEventType.Goal]: 'Gol',
  [MatchEventType.PenaltyGoal]: 'Gol de penalti',
  [MatchEventType.FailedPenalty]: 'Penalti fallado',
  [MatchEventType.YellowCard]: 'Tarjeta amarilla',
  [MatchEventType.RedCard]: 'Tarjeta roja',
  [MatchEventType.HalfTime]: 'Descanso',
  [MatchEventType.FinalTime]: 'Final',
  [MatchEventType.Overtime]: 'Prórroga',
  [MatchEventType.None]: '',
};

export interface MatchEvent {
  type: MatchEventType;
  minute?: number | string;
  extraMinute?: number;
  team?: number;
  playerName?: string;
  score?: string;
  extra?: string;
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
  breaks?: MatchEvent[];
  finals?: MatchEvent[];
  overtime?: MatchEvent[];
  penalties?: MatchEvent[]; // tanda de penaltis
}

export type FormValues = { home: string; away: string };
