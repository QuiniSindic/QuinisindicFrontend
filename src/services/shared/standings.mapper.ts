import { TeamStandingData } from '@/types/domain/standings';

interface RawStandingTeam {
  id: string;
  position: number;
  name: string;
  badge: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  form: TeamStandingData['form'];
}

export const mapStandingTeam = (team: RawStandingTeam): TeamStandingData => ({
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
