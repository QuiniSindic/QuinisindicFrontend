import {
  ActionGroups,
  MatchData,
  MatchEvent,
  MatchEventType,
  MatchStatus,
  ParsedMinute,
} from '@/types/domain/events';
import dayjs from 'dayjs';
import { COMPETITIONS_ID_MAP, SPORTS_LIST_ITEMS } from './sports';

export const NOT_LIVE: MatchStatus[] = ['NS', 'FT', 'Canc.', 'Susp.'];
export const CANCELED: MatchStatus[] = ['Canc.', 'Susp.'];
export const IS_LIVE: MatchStatus[] = ['HT', 'OT', '1H', '2H', 'Pen'];
export const IS_FINISHED: MatchStatus[] = ['FT', 'AET', 'AP', 'Canc.', 'Susp.'];

export function isLive(status: MatchStatus) {
  const s = String(status);
  return !(s === 'NS' || isFinished(status));
}

export function isFinished(status: MatchStatus) {
  const s = String(status);
  return IS_FINISHED.includes(s as any) || CANCELED.includes(s as any);
}

export const concatenateAndSortEvents = ({
  upcoming,
  live,
}: {
  upcoming: MatchData[];
  live: MatchData[];
}): MatchData[] => {
  const events = [...upcoming, ...live];

  return events.sort((a, b) => {
    const aLive = isLive(a.status);
    const bLive = isLive(b.status);
    if (aLive !== bLive) return aLive ? -1 : 1;

    const aDate = dayjs(a.kickoff);
    const bDate = dayjs(b.kickoff);
    return aDate.valueOf() - bDate.valueOf();
  });
};

export const competitionIdsForSport = (sportName?: string): Set<number> => {
  if (!sportName) return new Set<number>();

  const sport = SPORTS_LIST_ITEMS.find((s) => s.name === sportName);
  if (!sport) return new Set<number>();

  const ids = sport.leagues
    .map((lg) => COMPETITIONS_ID_MAP[lg])
    .filter((id): id is number => typeof id === 'number');

  return new Set(ids);
};

// --- FIX PRINCIPAL: parseMinute ya no acepta segundo argumento ---
export function parseMinute(
  minute: number | string | null | undefined,
): ParsedMinute {
  if (minute == null) return { min: 0, extra: 0, total: 0, label: '' };

  // Convertimos SIEMPRE a string primero para parsear
  const s = String(minute).trim().replace("'", '');

  // Caso: "90+4"
  if (s.includes('+')) {
    const [mm, ee] = s.split('+');
    const min = Number(mm) || 0;
    const ex = Number(ee) || 0;
    return { min, extra: ex, total: min + ex, label: `${min}+${ex}'` };
  }

  // Caso normal: "45" o 45
  const min = Number(s) || 0;
  return {
    min,
    extra: 0,
    total: min,
    label: `${min}'`,
  };
}

export const makeActionGroupsForMatch = (
  events: MatchEvent[],
): ActionGroups => {
  const groups: ActionGroups = {
    firstHalf: [],
    secondHalf: [],
    overtime: [],
    penalties: [],
    breaks: [],
    finals: [],
  };

  if (!events || events.length === 0) return groups;

  // 1. Ordenamos por minuto de menor a mayor para procesar lógicamente
  const sortedEvents = [...events].sort((a, b) => a?.minute - b.minute);

  sortedEvents.forEach((event) => {
    const min = event.minute;

    // 1. Clasificación por tipo de evento
    if (event.type === 'Half' || event.type === MatchEventType.Half) {
      groups.breaks.push(event);
      return;
    }

    if (event.isPenaltyShootout) {
      groups.penalties.push(event);
      return;
    }

    // 2. Clasificación por tiempo (Minutos corregidos según tu log)
    // Usamos > 45 para asegurar que el inicio de la 2H (min 46) entre en su grupo
    if (min > 90) {
      groups.overtime.push(event);
    } else if (min > 45) {
      groups.secondHalf.push(event);
    } else {
      groups.firstHalf.push(event);
    }
  });

  return groups;
};
