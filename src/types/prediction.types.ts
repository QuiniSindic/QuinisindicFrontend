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
