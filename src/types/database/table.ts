export interface Prediction {
  id: string;
  user_id: string;
  match_id: number;
  competition_id: number;
  sport_id: number;
  home_score: number;
  away_score: number;
  points: number | null;
  created_at: string;
  updated_at: string;
  status: string;
}
