export interface QuinielaData {
  fecha_sorteo: string;
  dia_semana: string;
  id_sorteo: string;
  game_id: string;
  anyo: string;
  premio_bote: string;
  cdc: string;
  apuestas: string;
  recaudacion: string;
  combinacion: string;
  premios: string;
  fondo_bote: string;
  escrutinio: Escrutinio[];
  partidos: Partido[];
  temporada: string;
  jornada: string;
  elige8: Elige8;
  escrutinioElige8: Escrutinio[];
}

export interface Elige8 {
  gameid: string;
  relsorteoid_asociado: string;
  activo: string;
}

export interface Partido {
  local: string;
  visitante: string;
  signo: string;
  marcador: string;
}

export interface Escrutinio {
  tipo: string;
  categoria: number;
  premio: string;
  ganadores: string;
}

export interface QuinielaResponse {
  data: QuinielaData;
  date: string;
}
