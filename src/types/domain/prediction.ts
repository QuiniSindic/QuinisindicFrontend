export interface PredictionView {
  id: string;
  userId: string;
  username: string;
  matchId: number;
  kickoff: string;
  matchStatus: string;
  homeTeam: string;
  awayTeam: string;
  predicted: string;
  homeScore: number | null;
  awayScore: number | null;
  minute: string | null;
  sportId: number;
  sportName: string;
  competitionId: number;
  competitionName: string;
  points: number | null;
  createdAt: string;
}

export interface PredictionPayload {
  competition_id: number;
  sport_id: number;
  event_id: number;
  home_score: number;
  away_score: number;
}

export interface PredictionUpdatePayload {
  home_score: number;
  away_score: number;
}

export type PredictionGroup = {
  sportId: number;
  sportName: string;
  leagues: Array<{
    competitionId: number;
    competitionName: string;
    predictions: PredictionView[];
  }>;
};
