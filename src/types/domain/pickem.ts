export type PickemTeam = {
  id: number;
  name: string;
  abbr: string;
  badge: string | null;
  country: string | null;
};

export type PickemGroupTeam = PickemTeam & {
  position: number;
};

export type PickemGroup = {
  id: number;
  key: string;
  name: string;
  order: number;
  teams: PickemGroupTeam[];
};

export type PickemAwardCandidate = {
  id: number;
  award_key: 'mvp' | 'top_scorer' | 'best_goalkeeper';
  display_name: string;
  participant_id: number | null;
  player_id: number | null;
  squad_player_id: number | null;
  team_id: number | null;
  team_name: string | null;
  position_desc: string | null;
  is_goalkeeper: boolean | null;
  is_active: boolean;
};

export type PickemContest = {
  id: number;
  slug: string;
  name: string;
  competition_id: number;
  competition_season_id: number;
  group_deadline: string;
  awards_deadline: string;
  scoring_config: Record<string, unknown>;
  groups: PickemGroup[];
  award_candidates: PickemAwardCandidate[];
  champion_candidates: PickemTeam[];
};

export type PickemGroupPick = {
  group_id: number;
  participant_id: number;
  predicted_position: number;
  points: number | null;
  is_exact: boolean | null;
};

export type PickemAwardPick = {
  award_key: 'mvp' | 'top_scorer' | 'best_goalkeeper' | 'champion';
  candidate_id: number | null;
  participant_id: number | null;
  points: number | null;
  is_hit: boolean | null;
};

export type PickemMatchPick = {
  event_id: number;
  winner_participant_id: number;
  home_score: number | null;
  away_score: number | null;
  points: number | null;
  winner_points: number | null;
  exact_score_points: number | null;
  is_winner_hit: boolean | null;
  is_exact_score: boolean | null;
};

export type PickemEntry = {
  id: string;
  contest_id: number;
  user_id: string;
  total_points: number;
  group_points: number;
  knockout_points: number;
  award_points: number;
  perfect_groups: number;
  exact_scores: number;
  group_picks: PickemGroupPick[];
  award_picks: PickemAwardPick[];
  match_picks: PickemMatchPick[];
};

export type PickemLeaderboardEntry = {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  group_points: number;
  knockout_points: number;
  award_points: number;
  perfect_groups: number;
  exact_scores: number;
};

export type PickemGroupOrderPicksPayload = {
  groups: Array<{
    group_id: number;
    participant_ids: number[];
  }>;
};

export type PickemAwardPicksPayload = {
  mvp_candidate_id: number;
  top_scorer_candidate_id: number;
  best_goalkeeper_candidate_id: number;
  champion_participant_id: number;
};
