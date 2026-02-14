export interface LastFiveMatches {
  result: string;
  match_id: string;
  result_code: number;
}

export interface TeamStandingData {
  id: string; // string ex: 4009 Real Madrid
  name: string; // nombre del equipo Real MMadrid
  badge: string; // escudo
  position: number; // posicion en la tabla (1 es lider)
  played: number; // number ex: 38 partidos jugados
  points: number; // number ex: 95 puntos
  wins: number; // number ex: 30 wins
  draws: number; // number ex: 5 draws
  losses: number; // number ex: 3 losses
  goalsFor: number; // number ex: 90 goals for
  goalsAgainst: number; // number ex: 30 goals against
  goalDifference: number; // number ex: 60 goal difference
  form: LastFiveMatches[]; // last five matches
}

export interface CompetitionStandingData {
  id: string; // id de competicion ex 75 la liga
  teams: TeamStandingData[];
}
