import { CompetitionData } from '@/types/domain/competitions';
import { MatchData, MatchStatus, TeamInfo } from '@/types/domain/events';

export interface RawCompetitionRow {
  id: number;
  name: string;
  badge: string;
  country: string | null;
  sport_id?: number;
}

export interface RawMatchRow {
  id: number;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  kickoff: string;
  minute?: string | null;
  home_team_id: number;
  away_team_id: number;
  competition_id: number;
  sport_id: number;
  home_team_data: TeamInfo;
  away_team_data: TeamInfo;
  round?: string | null;
  events?: MatchData['events'];
  competitions?: RawCompetitionRow | null;
}

export const mapMatchRow = (
  match: RawMatchRow,
  competition?: RawCompetitionRow | null,
): MatchData => ({
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
  sportId: competition?.sport_id ?? match.sport_id,
  homeTeam: match.home_team_data,
  awayTeam: match.away_team_data,
  country: competition?.country || '',
  events: match.events || [],
  round: match.round || undefined,
});

export const groupMatchesByCompetition = (
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

    competitionMap.get(mapKey)?.matches.push(mapMatchRow(match, competition));
  });

  return Array.from(competitionMap.values());
};
