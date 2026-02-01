import dayjs from 'dayjs';
import {
  ActionGroups,
  MatchData,
  MatchEvent,
  MatchEventType,
  MatchStatus,
  ParsedMinute,
} from '../types/events/events.types';
import { COMPETITIONS_ID_MAP, SPORTS_LIST_ITEMS } from './sports.utils';

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

const safeTotal = (ev: MatchEvent): number => {
  // Usamos timeStr si existe, si no el minute
  const val = ev.timeStr ?? ev.minute;

  if (val == null) return -1; // Al fondo si no tiene minuto

  // Delegamos en parseMinute (sin pasar extraMinute, que ya no existe)
  const { total } = parseMinute(val);
  return total;
};

export function makeActionGroupsForMatch(
  actions: MatchEvent[] = [],
): ActionGroups {
  if (!actions || actions.length === 0) {
    return {
      firstHalf: [],
      secondHalf: [],
      breaks: [],
      finals: [],
      overtime: [],
      penalties: [],
    };
  }

  // 1. Localizar marcadores de fase (HT, FT)
  const idxHT = actions.findIndex(
    (a) => a.type === MatchEventType.Half && a.label === 'HT',
  );
  const idxFT = actions.findIndex(
    (a) => a.type === MatchEventType.Half && a.label === 'FT',
  );

  // 2. Cortar el array
  const beforeHT = idxHT >= 0 ? actions.slice(0, idxHT) : actions.slice();

  const betweenHTFT =
    idxHT >= 0 && idxFT >= 0
      ? actions.slice(idxHT + 1, idxFT)
      : idxHT >= 0
        ? actions.slice(idxHT + 1)
        : [];

  const afterFT = idxFT >= 0 ? actions.slice(idxFT + 1) : [];

  // 3. Filtrar eventos relevantes
  const isRelevant = (e: MatchEvent) =>
    e.type === MatchEventType.Goal ||
    e.type === MatchEventType.Card ||
    e.type === MatchEventType.Substitution ||
    e.type === MatchEventType.PenaltyGoal ||
    e.type === MatchEventType.FailedPenalty;

  // 4. Ordenar descendente
  const sortByDesc = (arr: MatchEvent[]) =>
    arr.filter(isRelevant).sort((a, b) => safeTotal(b) - safeTotal(a));

  const firstHalf = sortByDesc(beforeHT);
  const secondHalf = sortByDesc(betweenHTFT);
  const overtimeSorted = sortByDesc(afterFT);

  // 5. Penaltis
  const penalties = afterFT.filter(
    (e) =>
      e.isPenalty ||
      e.type === MatchEventType.PenaltyGoal ||
      e.type === MatchEventType.FailedPenalty,
  );

  // Marcadores
  const breaks = actions.filter(
    (a) => a.type === MatchEventType.Half && a.label === 'HT',
  );
  const finals = actions.filter(
    (a) => a.type === MatchEventType.Half && a.label === 'FT',
  );

  return {
    firstHalf,
    secondHalf,
    breaks,
    finals,
    overtime: overtimeSorted,
    penalties,
  };
}
