import { CompetitionData } from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';
import { createClient } from '@/utils/supabase/client';
import dayjs from 'dayjs';

export async function getLiveMatches(
  sport?: number,
  competitionId?: number,
  fromDate?: string, // 'YYYY-MM-DD'
  toDate?: string, // 'YYYY-MM-DD'
): Promise<CompetitionData[]> {
  const supabase = createClient();

  // 1. Consultamos 'matches' directamente para poder filtrar por fecha eficientemente
  // Usamos !inner en competitions si necesitamos filtrar por deporte
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

  // 2. Filtros
  if (competitionId) {
    query = query.eq('competition_id', competitionId);
  }

  if (sport) {
    query = query.eq('competitions.sport_id', sport);
  }

  // 3. Ventana de Tiempo (CLAVE PARA RENDIMIENTO) 📅
  if (fromDate && toDate) {
    // Si el usuario eligió fechas en el calendario
    const start = dayjs(fromDate).startOf('day').toISOString();
    const end = dayjs(toDate).endOf('day').toISOString();
    query = query.gte('kickoff', start).lte('kickoff', end);
  } else {
    // POR DEFECTO: Solo traemos partidos de HOY y MAÑANA (48h)
    // Esto hace que la carga inicial sea ligerísima (5KB vs 500KB)
    const now = dayjs().subtract(2, 'hours').toISOString(); // Un poco de margen atrás
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

  // 4. Reconstruimos la estructura CompetitionData (Agrupamos por liga)
  const competitionMap = new Map<string, CompetitionData>();

  matches?.forEach((match: any) => {
    const compId = match.competitions?.id;
    if (!compId) return;

    // Si la competición no está en el mapa, la creamos
    if (!competitionMap.has(compId)) {
      competitionMap.set(compId, {
        id: compId.toString(),
        name: match.competitions.name,
        fullName: match.competitions.name,
        badge: match.competitions.badge,
        matches: [],
      });
    }

    // Añadimos el partido formateado
    competitionMap.get(compId)!.matches.push({
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
      round: match.round, // Importante conservarlo
    });
  });

  return Array.from(competitionMap.values());
}

export const getMatchDataV2 = async (id: number): Promise<MatchData | null> => {
  const supabase = createClient();

  // Hacemos un join con 'competitions' para sacar el nombre del torneo y país
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

  // Mapeamos de la estructura DB a MatchData del frontend
  return {
    id: match.id,
    status: match.status,
    // Construimos el resultado "2-1" o "vs"
    result:
      match.home_score !== null && match.away_score !== null
        ? `${match.home_score}-${match.away_score}`
        : 'vs',
    kickoff: match.kickoff, // Supabase devuelve ISO string, que es lo que espera tu UI o date parser
    minute: match.minute,
    homeId: match.home_team_id,
    awayId: match.away_team_id,

    // Datos JSONB que guardaste con Python
    homeTeam: match.home_team_data,
    awayTeam: match.away_team_data,

    // Datos del Join con competitions
    competitionid: match.competitions?.id,
    sportId: match.competitions?.sport_id,
    country: match.competitions?.country || '',

    events: match.events,
  };
};

// Rondas que consideramos de Bracket/Eliminatorias
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
// (Añade también las versiones en español si tu scraper las guarda así: 'octavos', 'cuartos', etc.)

export async function getBracketMatches(
  competitionId: number,
): Promise<MatchData[]> {
  const supabase = createClient();

  // Pedimos SOLO los partidos de esa competición que tengan ronda asignada
  // y, opcionalmente, filtramos para que no traiga la fase de grupos (rondas "1", "2", "3"...)
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
    // Filtro clave: Solo traemos filas cuyo 'round' coincida con nuestra lista
    // Si tu scraper guarda "1", "2", etc para grupos, esto los excluirá.
    .in('round', KNOCKOUT_ROUNDS)
    .order('kickoff', { ascending: true });

  if (error) {
    console.error('Error fetching bracket matches:', error);
    return [];
  }

  // Mapeamos a tu tipo MatchData
  return (data || []).map((match) => ({
    id: match.id,
    status: match.status,
    result:
      match.home_score !== null
        ? `${match.home_score}-${match.away_score}`
        : 'vs',
    kickoff: match.kickoff,
    round: match.round, // Importante para el bracket
    homeId: match.home_team_id,
    awayId: match.away_team_id,
    competitionid: match.competition_id,
    sportId: match.sport_id,
    homeTeam: match.home_team_data,
    awayTeam: match.away_team_data,
    country: '', // Opcional aquí
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
    `); // Nota: no pedimos home_team_data/away si no hace falta, pero suele hacer falta

  // Filtros básicos
  if (competitionId) query = query.eq('competition_id', competitionId);
  if (sport) query = query.eq('competitions.sport_id', sport);

  // Filtro de ESTADO: Solo partidos terminados
  // Ajusta según tus status ('FT', 'AET', 'Pen', etc.)
  query = query.in('status', ['FT', 'AET', 'AP', 'Pen']);

  // Ventana de Tiempo (PASADO)
  if (fromDate && toDate) {
    const start = dayjs(fromDate).startOf('day').toISOString();
    const end = dayjs(toDate).endOf('day').toISOString();
    query = query.gte('kickoff', start).lte('kickoff', end);
  } else {
    // POR DEFECTO: Últimos 3 días (Ayer, Hoy, Anteayer)
    const threeDaysAgo = dayjs()
      .subtract(3, 'day')
      .startOf('day')
      .toISOString();
    const now = dayjs().endOf('day').toISOString();
    query = query.gte('kickoff', threeDaysAgo).lte('kickoff', now);
  }

  // Orden descendente (lo más reciente primero)
  const { data: matches, error } = await query.order('kickoff', {
    ascending: false,
  });

  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }

  const competitionMap = new Map<string, CompetitionData>();

  matches?.forEach((match: any) => {
    const compId = match.competitions?.id;
    if (!compId) return;

    // Si la competición no está en el mapa, la creamos
    if (!competitionMap.has(compId)) {
      competitionMap.set(compId, {
        id: compId.toString(),
        name: match.competitions.name,
        fullName: match.competitions.name,
        badge: match.competitions.badge,
        matches: [],
      });
    }

    // Añadimos el partido formateado
    competitionMap.get(compId)!.matches.push({
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
      round: match.round, // Importante conservarlo
    });
  });

  return Array.from(competitionMap.values());
}
