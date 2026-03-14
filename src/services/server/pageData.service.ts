import { PublicProfile, User } from '@/types/auth/auth';
import { Prediction } from '@/types/database/table';
import { CompetitionData, CompetitionLite } from '@/types/domain/competitions';
import {
  FINISHED_MATCH_STATUSES,
  MatchData,
  MatchLite,
} from '@/types/domain/events';
import { SportLite } from '@/types/domain/sports';
import { getTeamName } from '@/utils/domain/events';
import { createClient } from '@/utils/supabase/server';
import { toSpanishSportName } from '@/utils/ui/sportName';
import dayjs from 'dayjs';

type RawCompetition = {
  id: number;
  name: string;
  badge: string;
  country: string | null;
  sport_id?: number;
};

type RawMatchRow = {
  id: number;
  status: MatchData['status'];
  home_score: number | null;
  away_score: number | null;
  kickoff: string;
  minute?: string | null;
  home_team_id: number;
  away_team_id: number;
  competition_id: number;
  sport_id: number;
  home_team_data: MatchData['homeTeam'];
  away_team_data: MatchData['awayTeam'];
  round?: string | null;
  events?: MatchData['events'];
  competitions?: RawCompetition | null;
};

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

const groupMatchesByCompetition = (
  matches: RawMatchRow[] | null | undefined,
): CompetitionData[] => {
  const competitionMap = new Map<string, CompetitionData>();

  matches?.forEach((match) => {
    const competition = match.competitions;
    if (!competition?.id) return;

    const mapKey = String(competition.id);
    if (!competitionMap.has(mapKey)) {
      competitionMap.set(mapKey, {
        id: mapKey,
        name: competition.name,
        fullName: competition.name,
        badge: competition.badge,
        country: competition.country || '',
        matches: [],
      });
    }

    competitionMap.get(mapKey)?.matches.push({
      id: match.id,
      status: match.status,
      result:
        match.home_score !== null && match.away_score !== null
          ? `${match.home_score}-${match.away_score}`
          : 'vs',
      kickoff: match.kickoff,
      minute: match.minute || undefined,
      homeId: match.home_team_id,
      awayId: match.away_team_id,
      competitionid: match.competition_id,
      sportId: match.sport_id,
      homeTeam: match.home_team_data,
      awayTeam: match.away_team_data,
      country: competition.country || '',
      events: match.events || [],
      round: match.round || undefined,
    });
  });

  return Array.from(competitionMap.values());
};

const mapUser = (user: {
  id: string;
  email?: string;
  user_metadata?: { username?: string };
}): User => ({
  id: user.id,
  email: user.email || '',
  username:
    user.user_metadata?.username || user.email?.split('@')[0] || 'Usuario',
  password: '',
  provider: 'local',
  createdAt: undefined,
  updatedAt: undefined,
});

export async function getServerCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? mapUser(user) : null;
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
    // si no tiene fechas filtra:
    // desde fecha actual - 2 horas
    // hasta fecha actual + 2 dias
    query = query
      .gte('kickoff', dayjs().subtract(2, 'hours').toISOString())
      .lte('kickoff', dayjs().add(48, 'hours').toISOString());
  }

  const { data, error } = await query.order('kickoff', { ascending: true });

  if (error) {
    // TODO: gestioanr mejor errores
    console.error('Error fetching live matches on server:', error);
    return [];
  }

  return groupMatchesByCompetition((data ?? []) as RawMatchRow[]);
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

  return groupMatchesByCompetition((data ?? []) as RawMatchRow[]);
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
}

export async function getServerEventPredictions(
  eventId: number,
): Promise<Prediction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('match_id', eventId);

  if (error) {
    console.error('Error fetching server event predictions:', error);
    return [];
  }

  return (data ?? []) as Prediction[];
}

export async function getServerUserMatchPrediction(
  eventId: number,
): Promise<Prediction | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('match_id', eventId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching server user prediction:', error);
  }

  return (data as Prediction | null) ?? null;
}

const getServerUsernames = async (
  userIds: string[],
): Promise<Record<string, PublicProfile>> => {
  if (userIds.length === 0) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, avatar_url')
    .in('id', userIds);

  if (error) {
    console.error('Error fetching server profiles:', error);
    return {};
  }

  const profiles: Record<string, PublicProfile> = {};

  (data ?? []).forEach((profile) => {
    if (!profile.id) return;

    profiles[profile.id] = {
      id: profile.id,
      username: profile.username || profile.email?.split('@')[0] || 'Usuario',
      email: profile.email,
      img: profile.avatar_url,
    };
  });

  return profiles;
};

export async function getServerPredictionsFeed() {
  const supabase = await createClient();
  const { data: predictionsRaw, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw new Error(error.message);
  }

  const predictions = (predictionsRaw ?? []) as Prediction[];
  if (predictions.length === 0) return [];

  const matchIds = Array.from(new Set(predictions.map((row) => row.match_id)));
  const competitionIds = Array.from(
    new Set(predictions.map((row) => row.competition_id)),
  );
  const sportIds = Array.from(new Set(predictions.map((row) => row.sport_id)));
  const userIds = Array.from(new Set(predictions.map((row) => row.user_id)));

  const [matchesRes, competitionsRes, sportsRes, usersMap] = await Promise.all([
    supabase
      .from('matches')
      .select(
        'id, kickoff, status, minute, home_team_data, away_team_data, home_score, away_score',
      )
      .in('id', matchIds),
    supabase.from('competitions').select('id, name').in('id', competitionIds),
    supabase.from('sports').select('id, name').in('id', sportIds),
    getServerUsernames(userIds),
  ]);

  if (matchesRes.error) throw new Error(matchesRes.error.message);
  if (competitionsRes.error) throw new Error(competitionsRes.error.message);
  if (sportsRes.error) throw new Error(sportsRes.error.message);

  const matches = (matchesRes.data ?? []) as MatchLite[];
  const competitions = (competitionsRes.data ?? []) as CompetitionLite[];
  const sports = (sportsRes.data ?? []) as SportLite[];

  const matchById = new Map(matches.map((match) => [match.id, match]));
  const competitionById = new Map(
    competitions.map((competition) => [competition.id, competition]),
  );
  const sportById = new Map(sports.map((sport) => [sport.id, sport]));

  return predictions.map((prediction) => {
    const match = matchById.get(prediction.match_id);
    const competition = competitionById.get(prediction.competition_id);
    const sport = sportById.get(prediction.sport_id);
    const profile = usersMap[prediction.user_id];

    return {
      id: prediction.id,
      userId: prediction.user_id,
      username: profile?.username ?? 'Usuario',
      matchId: prediction.match_id,
      kickoff: match?.kickoff ?? prediction.created_at,
      matchStatus: match?.status ?? prediction.status,
      homeTeam: getTeamName(match?.home_team_data, 'Local'),
      awayTeam: getTeamName(match?.away_team_data, 'Visitante'),
      predicted: `${prediction.home_score} - ${prediction.away_score}`,
      homeScore: match?.home_score ?? null,
      awayScore: match?.away_score ?? null,
      minute: match?.minute ?? null,
      sportId: prediction.sport_id,
      sportName:
        toSpanishSportName(sport?.name) || `Deporte ${prediction.sport_id}`,
      competitionId: prediction.competition_id,
      competitionName: competition?.name ?? `Liga ${prediction.competition_id}`,
      points: prediction.points,
      createdAt: prediction.created_at,
    };
  });
}

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

export async function getServerLeaderboardFilterOptions() {
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
