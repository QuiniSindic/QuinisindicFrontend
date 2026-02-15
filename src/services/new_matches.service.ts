import { CompetitionData } from '@/types/domain/competitions';
import { FINISHED_MATCH_STATUSES, MatchData } from '@/types/domain/events';
import { createClient } from '@/utils/supabase/client';
import dayjs from 'dayjs';

const groupMatchesByCompetition = (
  matches: any[] | null | undefined,
): CompetitionData[] => {
  const competitionMap = new Map<string, CompetitionData>();

  matches?.forEach((match: any) => {
    const compId = match.competitions?.id;
    if (!compId) return;

    const mapKey = String(compId);
    if (!competitionMap.has(mapKey)) {
      competitionMap.set(mapKey, {
        id: mapKey,
        name: match.competitions.name,
        fullName: match.competitions.name,
        badge: match.competitions.badge,
        country: match.competitions.country || '',
        matches: [],
      });
    }

    competitionMap.get(mapKey)!.matches.push({
      id: match.id,
      status: match.status,
      result:
        match.home_score !== null
          ? `${match.home_score}-${match.away_score}`
          : 'vs',
      kickoff: match.kickoff,
      minute: match.minute,
      homeId: match.home_team_id,
      awayId: match.away_team_id,
      competitionid: match.competition_id,
      sportId: match.sport_id,
      homeTeam: match.home_team_data,
      awayTeam: match.away_team_data,
      country: match.competitions.country || '',
      events: [],
      round: match.round,
    });
  });

  return Array.from(competitionMap.values());
};

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

  if (competitionId) {
    query = query.eq('competition_id', competitionId);
  }

  if (sport) {
    query = query.eq('competitions.sport_id', sport);
  }

  if (fromDate && toDate) {
    const start = dayjs(fromDate).startOf('day').toISOString();
    const end = dayjs(toDate).endOf('day').toISOString();
    query = query.gte('kickoff', start).lte('kickoff', end);
  } else {
    const now = dayjs().subtract(2, 'hours').toISOString();
    const limit = dayjs().add(48, 'hours').toISOString();
    query = query.gte('kickoff', now).lte('kickoff', limit);
  }

  const { data: matches, error } = await query.order('kickoff', {
    ascending: true,
  });

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  return groupMatchesByCompetition(matches);
}

export const getMatchDataV2 = async (id: number): Promise<MatchData | null> => {
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

  return {
    id: match.id,
    status: match.status,
    result:
      match.home_score !== null && match.away_score !== null
        ? `${match.home_score}-${match.away_score}`
        : 'vs',
    kickoff: match.kickoff,
    minute: match.minute,
    homeId: match.home_team_id,
    awayId: match.away_team_id,
    homeTeam: match.home_team_data,
    awayTeam: match.away_team_data,
    competitionid: match.competitions?.id,
    sportId: match.competitions?.sport_id,
    country: match.competitions?.country || '',
    events: match.events,
  };
};

const KNOCKOUT_ROUNDS = [
  'playoff',
  '1/8',
  '1/4',
  '1/2',
  'final',
  'semi-finals',
  'quarter-finals',
  'round of 16',
];

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
    .in('round', KNOCKOUT_ROUNDS)
    .order('kickoff', { ascending: true });

  if (error) {
    console.error('Error fetching bracket matches:', error);
    return [];
  }

  return (data || []).map((match) => ({
    id: match.id,
    status: match.status,
    result:
      match.home_score !== null
        ? `${match.home_score}-${match.away_score}`
        : 'vs',
    kickoff: match.kickoff,
    round: match.round,
    homeId: match.home_team_id,
    awayId: match.away_team_id,
    competitionid: match.competition_id,
    sportId: match.sport_id,
    homeTeam: match.home_team_data,
    awayTeam: match.away_team_data,
    country: '',
    events: [],
  }));
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
    const start = dayjs(fromDate).startOf('day').toISOString();
    const end = dayjs(toDate).endOf('day').toISOString();
    query = query.gte('kickoff', start).lte('kickoff', end);
  } else {
    const threeDaysAgo = dayjs()
      .subtract(3, 'day')
      .startOf('day')
      .toISOString();
    const now = dayjs().endOf('day').toISOString();
    query = query.gte('kickoff', threeDaysAgo).lte('kickoff', now);
  }

  const { data: matches, error } = await query.order('kickoff', {
    ascending: false,
  });

  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }

  return groupMatchesByCompetition(matches);
}
