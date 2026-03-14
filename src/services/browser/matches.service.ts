import { CompetitionData } from '@/types/domain/competitions';
import { FINISHED_MATCH_STATUSES, MatchData } from '@/types/domain/events';
import { createClient } from '@/utils/supabase/client';
import dayjs from 'dayjs';
import {
  groupMatchesByCompetition,
  mapMatchRow,
  RawMatchRow,
} from '@/services/shared/matches.mapper';

const KNOCKOUT_ROUNDS = [
  'playoff',
  '1/8',
  '1/4',
  '1/2',
  'final',
  'semi-finals',
  'quarter-finals',
  'round of 16',
] as const;

export async function getLiveMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
): Promise<CompetitionData[]> {
  const supabase = createClient();

  let query = supabase.from('matches').select(`
      *,
      home_team_data,
      away_team_data,
      competitions!inner (
        id,
        name,
        badge,
        country,
        sport_id
      )
    `);

  if (competitionId) query = query.eq('competition_id', competitionId);
  if (sport) query = query.eq('competitions.sport_id', sport);

  if (fromDate && toDate) {
    query = query
      .gte('kickoff', dayjs(fromDate).startOf('day').toISOString())
      .lte('kickoff', dayjs(toDate).endOf('day').toISOString());
  } else {
    query = query
      .gte('kickoff', dayjs().subtract(2, 'hours').toISOString())
      .lte('kickoff', dayjs().add(48, 'hours').toISOString());
  }

  const { data, error } = await query.order('kickoff', { ascending: true });

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return groupMatchesByCompetition((data ?? []) as RawMatchRow[]);
}

export const getMatchData = async (id: number): Promise<MatchData | null> => {
  const supabase = createClient();

  const { data: match, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      competitions (
        id,
        name,
        country,
        sport_id
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error || !match) {
    console.error('Error fetching match data:', error);
    return null;
  }

  return mapMatchRow(match as RawMatchRow, match.competitions);
};

export async function getBracketMatches(
  competitionId: number,
): Promise<MatchData[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      home_team_data,
      away_team_data
    `,
    )
    .eq('competition_id', competitionId)
    .in('round', [...KNOCKOUT_ROUNDS])
    .order('kickoff', { ascending: true });

  if (error) {
    console.error('Error fetching bracket matches:', error);
    return [];
  }

  return ((data ?? []) as RawMatchRow[]).map((match) => mapMatchRow(match));
}

export async function getPastMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
): Promise<CompetitionData[]> {
  const supabase = createClient();

  let query = supabase.from('matches').select(`
      *,
      competitions!inner (id, name, badge, country, sport_id)
    `);

  if (competitionId) query = query.eq('competition_id', competitionId);
  if (sport) query = query.eq('competitions.sport_id', sport);

  query = query.in('status', [...FINISHED_MATCH_STATUSES]);

  if (fromDate && toDate) {
    query = query
      .gte('kickoff', dayjs(fromDate).startOf('day').toISOString())
      .lte('kickoff', dayjs(toDate).endOf('day').toISOString());
  } else {
    query = query
      .gte('kickoff', dayjs().subtract(3, 'day').startOf('day').toISOString())
      .lte('kickoff', dayjs().endOf('day').toISOString());
  }

  const { data, error } = await query.order('kickoff', { ascending: false });

  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }

  return groupMatchesByCompetition((data ?? []) as RawMatchRow[]);
}
