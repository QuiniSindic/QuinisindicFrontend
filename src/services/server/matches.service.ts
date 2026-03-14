import { CompetitionData } from '@/types/domain/competitions';
import { FINISHED_MATCH_STATUSES, MatchData } from '@/types/domain/events';
import {
  groupMatchesByCompetition,
  mapMatchRow,
  RawCompetitionRow,
  RawMatchRow,
} from '@/services/shared/matches.mapper';
import { createClient } from '@/utils/supabase/server';
import dayjs from 'dayjs';

interface RawMatchWithCompetitionRow extends RawMatchRow {
  competitions?: RawCompetitionRow | null;
}

export async function getServerLiveMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
): Promise<CompetitionData[]> {
  const supabase = await createClient();

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

  if (competitionId) {
    query = query.eq('competition_id', competitionId);
  }

  if (sport) {
    query = query.eq('competitions.sport_id', sport);
  }

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
    console.error('Error fetching live matches on server:', error);
    return [];
  }

  return groupMatchesByCompetition((data ?? []) as RawMatchWithCompetitionRow[]);
}

export async function getServerPastMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string,
  toDate?: string,
): Promise<CompetitionData[]> {
  const supabase = await createClient();

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
    console.error('Error fetching past matches on server:', error);
    return [];
  }

  return groupMatchesByCompetition((data ?? []) as RawMatchWithCompetitionRow[]);
}

export async function getServerMatchData(
  id: number,
): Promise<MatchData | null> {
  const supabase = await createClient();
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
    console.error('Error fetching server match data:', error);
    return null;
  }

  return mapMatchRow(match as RawMatchWithCompetitionRow, match.competitions);
}
