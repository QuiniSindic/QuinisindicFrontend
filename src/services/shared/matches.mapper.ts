import { CompetitionRow, MatchRow } from '@/types/database';
import { DbMatchEventJson, DbTeamInfoJson } from '@/types/database/json';
import { CompetitionData } from '@/types/domain/competitions';
import { MatchData, MatchStatus, TeamInfo } from '@/types/domain/events';
import {
  buildKnockoutStages,
  inferCompetitionFormatKind,
} from '@/utils/domain/competitionStages';

export type CompetitionSummaryRow = Pick<
  CompetitionRow,
  'id' | 'name' | 'badge' | 'country' | 'sport_id'
>;

export type MatchRowWithCompetition = MatchRow & {
  competitions?: CompetitionSummaryRow | null;
};

const createFallbackTeam = (
  teamId: number | null,
  side: 'Local' | 'Visitante',
): TeamInfo => ({
  id: teamId ?? 0,
  name: side,
  abbr: side === 'Local' ? 'LOC' : 'VIS',
  img: null,
  country: '',
});

export const mapMatchRow = (
  match: MatchRowWithCompetition,
  competition?: CompetitionSummaryRow | null,
): MatchData => ({
  id: match.id,
  status: match.status as MatchStatus,
  result:
    match.home_score !== null && match.away_score !== null
      ? `${match.home_score}-${match.away_score}`
      : 'vs',
  kickoff: match.kickoff ?? '',
  minute: match.minute || undefined,
  homeId:
    match.home_team_id ??
    ((match.home_team_data as DbTeamInfoJson | null)?.id ?? 0),
  awayId:
    match.away_team_id ??
    ((match.away_team_data as DbTeamInfoJson | null)?.id ?? 0),
  competitionid: match.competition_id ?? competition?.id ?? 0,
  sportId: competition?.sport_id ?? match.sport_id ?? 0,
  homeTeam:
    (match.home_team_data as DbTeamInfoJson | null) ??
    createFallbackTeam(match.home_team_id, 'Local'),
  awayTeam:
    (match.away_team_data as DbTeamInfoJson | null) ??
    createFallbackTeam(match.away_team_id, 'Visitante'),
  country: competition?.country || '',
  events: (match.events as DbMatchEventJson[] | null) || [],
  round: match.round || undefined,
});

export const groupMatchesByCompetition = (
  matches: MatchRowWithCompetition[] | null | undefined,
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
        badge: competition.badge || '',
        country: competition.country || '',
        matches: [],
      });
    }

    competitionMap.get(mapKey)?.matches.push(mapMatchRow(match, competition));
  });

  return Array.from(competitionMap.values()).map((competition) => ({
    ...competition,
    formatKind: inferCompetitionFormatKind(competition.matches),
    stages: buildKnockoutStages(competition.matches),
  }));
};
