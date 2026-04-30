import {
  LeaderboardCompetitionRow,
  LeaderboardGlobalRow,
  LeaderboardSportRow,
} from '@/types/database';
import {
  LeaderboardEntry,
  LeaderboardFilterOption,
} from '@/types/domain/leaderboard';

type LeaderboardRow =
  | LeaderboardGlobalRow
  | LeaderboardSportRow
  | LeaderboardCompetitionRow;

type FilterOptionRow = {
  id: number;
  name: string | null;
};

export const mapLeaderboardRow = (row: LeaderboardRow): LeaderboardEntry => ({
  user_id: row.user_id ?? '',
  username: row.username ?? 'Usuario',
  avatar_url: row.avatar_url,
  total_points: row.total_points ?? 0,
  predictions_count: row.predictions_count ?? 0,
  exact_hits: row.exact_hits ?? 0,
});

export const mapLeaderboardFilterOption = (
  row: FilterOptionRow,
): LeaderboardFilterOption | null => {
  if (!row.name) return null;

  return {
    id: row.id,
    name: row.name,
  };
};
