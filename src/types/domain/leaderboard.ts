export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  predictions_count: number;
  exact_hits: number;
}

export interface LeaderboardFilterOption {
  id: number;
  name: string;
}
