import {
  LeaderboardEntry,
  LeaderboardFilterOption,
} from '@/types/domain/leaderboard';
import { createClient } from '@/utils/supabase/server';

export async function getServerLeaderboard(
  scope: 'global' | 'sport' | 'competition',
  filterId: number | null,
): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();

  let query;
  if (scope === 'global') {
    query = supabase.from('leaderboard_global').select('*');
  } else if (scope === 'sport' && filterId) {
    query = supabase
      .from('leaderboard_sport')
      .select('*')
      .eq('sport_id', filterId);
  } else if (scope === 'competition' && filterId) {
    query = supabase
      .from('leaderboard_competition')
      .select('*')
      .eq('competition_id', filterId);
  } else {
    return [];
  }

  const { data, error } = await query
    .order('total_points', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching server leaderboard:', error);
    return [];
  }

  return (data ?? []) as LeaderboardEntry[];
}

export async function getServerLeaderboardFilterOptions(): Promise<{
  sports: LeaderboardFilterOption[];
  competitions: LeaderboardFilterOption[];
}> {
  const supabase = await createClient();
  const [
    { data: sports, error: sportsError },
    { data: competitions, error: competitionsError },
  ] = await Promise.all([
    supabase.from('sports').select('id, name').order('name'),
    supabase.from('competitions').select('id, name').order('name'),
  ]);

  if (sportsError) {
    console.error('Error fetching sports options:', sportsError);
  }
  if (competitionsError) {
    console.error('Error fetching competition options:', competitionsError);
  }

  return {
    sports: (sports ?? []) as LeaderboardFilterOption[],
    competitions: (competitions ?? []) as LeaderboardFilterOption[],
  };
}
