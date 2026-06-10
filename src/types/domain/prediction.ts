export interface PredictionView {
  id: string;
  userId: string;
  username: string;
  matchId: number;
  kickoff: string;
  kickoffIso?: string | null;
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

export interface PredictionRow {
  id: string;
  user_id: string;
  match_id: number;
  competition_id: number | null;
  edition_id: number | null;
  sport_id: number | null;
  home_score: number;
  away_score: number;
  points: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
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
