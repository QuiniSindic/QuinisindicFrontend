import { CompetitionData, MatchData } from '@/types/events/events.types';
import { createClient } from '@/utils/supabase/client';

export async function getLiveMatches(
  sport?: number,
  competitionId?: number,
): Promise<CompetitionData[]> {
  const supabase = createClient();

  // 1. Iniciamos la construcción de la query
  // OJO: Si quieres filtrar por cosas de matches (ej: solo en vivo),
  // podrías necesitar 'matches!inner(*)' para hacer un INNER JOIN.
  let query = supabase.from('competitions').select(`
      *,
      matches (
        *,
        home_team_data,
        away_team_data
      )
    `);

  // 2. Aplicamos filtros condicionales DINÁMICAMENTE

  // Si nos pasan un ID de competición, filtramos la tabla 'competitions'
  if (competitionId) {
    query = query.eq('id', competitionId);
  }

  // Si tu tabla 'competitions' tiene una columna 'sport', filtramos por ella.
  // Si no tienes columna 'sport' en competitions, borra este bloque IF.
  if (sport) {
    // Asumiendo que guardas 'football' o 'basketball' en la columna 'sport'
    // Si tu DB usa IDs para deportes, tendrías que mapear el string a ID aquí.
    query = query.eq('sport_id', sport);
  }

  // 3. Ejecutamos la query final con ordenamiento
  const { data: competitions, error } = await query.order('id');

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  if (!competitions) return [];

  // 4. Mapeo de datos (Igual que lo tenías, solo añadí tipos explícitos para seguridad)
  const result: CompetitionData[] = competitions
    .map((comp: any) => {
      const matches: MatchData[] = comp.matches.map((m: any) => ({
        id: m.id,
        status: m.status,
        result: `${m.home_score}-${m.away_score}`,
        // Fix: Asegurar que la fecha es válida antes de parsear
        kickoff: m.kickoff,
        minute: m.minute || undefined,
        homeId: m.home_team_id,
        awayId: m.away_team_id,
        competitionid: comp.id,
        homeTeam: m.home_team_data,
        awayTeam: m.away_team_data,
        country: comp.country || '',
        events: [],
      }));

      // Si después de filtrar matches (si lo hicieras) la lista está vacía,
      // devolvemos null para filtrar la competición entera abajo.
      if (matches.length === 0) return null;

      return {
        id: comp.id.toString(),
        name: comp.name,
        fullName: comp.name, // Asegúrate de tener este campo en DB o usar name
        badge: comp.badge,
        matches: matches,
      };
    })
    .filter((c): c is CompetitionData => c !== null);

  return result;
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
        country
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
    country: match.competitions?.country || '',

    events: match.events,
  };
};
