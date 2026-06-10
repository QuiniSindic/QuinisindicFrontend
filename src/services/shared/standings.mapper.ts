import { DbStandingRowJson } from '@/types/database/json';
import {
  CompetitionStandingsSnapshot,
  TeamStandingData,
} from '@/types/domain/standings';

export const mapStandingTeam = (team: DbStandingRowJson): TeamStandingData => ({
  id: team.id,
  position: team.position,
  name: team.name,
  badge: team.badge,
  played: team.played,
  wins: team.wins,
  draws: team.draws,
  losses: team.losses,
  points: team.points,
  goalsFor: team.goalsFor,
  goalsAgainst: team.goalsAgainst,
  goalDifference: team.goalsFor - team.goalsAgainst,
  form: team.form,
});

export const buildCompetitionStandingsSnapshot = (
  competitionId: number,
  rows: DbStandingRowJson[] | null | undefined,
): CompetitionStandingsSnapshot => ({
  competitionId,
  stageId: 'league_table',
  stageName: 'Clasificacion',
  stageType: 'league_table',
  groups: [
    {
      id: 'overall',
      name: 'Tabla general',
      order: 0,
      teams: (rows ?? []).map(mapStandingTeam),
    },
  ],
});
