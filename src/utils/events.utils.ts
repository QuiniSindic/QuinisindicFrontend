import { leaguesIdMap } from '@/src/constants/mappers';

import dayjs from 'dayjs';
import {
  ActionGroups,
  MatchData,
  MatchEvent,
  MatchEventType,
  MatchStatus,
  ParsedMinute,
} from '../types/events/events.types';
import { SPORTS_LIST_ITEMS } from './sports.utils';

export const NOT_LIVE: MatchStatus[] = ['NS', 'FT', 'Canc.'];
export const CANCELED: MatchStatus[] = ['Canc.'];
export const IS_LIVE: MatchStatus[] = ['HT', 'OT'];
export const IS_FINISHED: MatchStatus[] = ['FT', 'AET', 'AP'];

export function isLive(status: MatchStatus) {
  return !(status === 'NS' || isFinished(status));
}

export function isFinished(status: MatchStatus) {
  return IS_FINISHED.includes(status) || CANCELED.includes(status);
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

    const ak = dayjs(a.kickoff, 'HH:mm DD/MM/YYYY').valueOf();
    const bk = dayjs(b.kickoff, 'HH:mm DD/MM/YYYY').valueOf();
    return ak - bk;
  });
};

export const competitionIdsForSport = (sportName?: string): Set<number> => {
  if (!sportName) return new Set<number>();

  const sport = SPORTS_LIST_ITEMS.find((s) => s.name === sportName);
  if (!sport) return new Set<number>();

  const ids = sport.leagues
    .map((lg) => leaguesIdMap[lg])
    .filter((id): id is number => typeof id === 'number');

  return new Set(ids);
};

export function isEndOfHalf(t: MatchEventType) {
  return (
    t === MatchEventType.HalfTime ||
    t === MatchEventType.FinalTime ||
    t === MatchEventType.Overtime
  );
}

export function parseMinute(
  minute: number | string | null | undefined,
  extra?: number | null,
): ParsedMinute {
  if (minute == null) return { min: 0, extra: 0, total: 0, label: '' };

  if (typeof minute === 'number') {
    const ex = extra ?? 0;
    return {
      min: minute,
      extra: ex,
      total: minute + ex,
      label: ex > 0 ? `${minute}+${ex}'` : `${minute}'`,
    };
  }

  const s = String(minute).trim().replace("'", '');
  if (s.includes('+')) {
    const [mm, ee] = s.split('+');
    const min = Number(mm) || 0;
    const ex = Number(ee) || 0;
    return { min, extra: ex, total: min + ex, label: `${min}+${ex}'` };
  }

  const min = Number(s) || 0;
  return { min, extra: 0, total: min, label: `${min}'` };
}

const isNumericMinute = (m: unknown): m is number =>
  typeof m === 'number' && !Number.isNaN(m);

const safeTotal = (ev: MatchEvent): number => {
  // Si no hay minuto numérico, devolvemos -Infinity para que queden al final
  if (!isNumericMinute(ev.minute)) return Number.NEGATIVE_INFINITY;
  const { total } = parseMinute(ev.minute, ev.extraMinute);
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

  // Localiza marcadores de fase
  const idxHT = actions.findIndex((a) => a.type === MatchEventType.HalfTime);
  const idxFT = actions.findIndex((a) => a.type === MatchEventType.FinalTime);
  const idxOT = actions.findIndex((a) => a.type === MatchEventType.Overtime);

  // Slices útiles
  const beforeHT = idxHT >= 0 ? actions.slice(0, idxHT) : actions.slice();
  const betweenHTFT =
    idxHT >= 0 && idxFT >= 0 ? actions.slice(idxHT + 1, idxFT) : [];
  const afterOT = idxOT >= 0 ? actions.slice(idxOT + 1) : [];

  // Clasificación tras OT:
  // - Prórroga: eventos con minuto numérico (95, 105, 120…)
  // - Tanda: goles (36) SIN minuto numérico (el feed los manda así)
  const overtime = afterOT.filter(
    (e) => e.type !== MatchEventType.Overtime && isNumericMinute(e.minute),
  );
  const rawPens = afterOT.filter(
    (e) => e.type === MatchEventType.Goal && !isNumericMinute(e.minute),
  );

  // Ordena grupos por minuto descendente (donde aplique)
  const sortByDescTotal = (arr: MatchEvent[]) =>
    arr.slice().sort((a, b) => safeTotal(b) - safeTotal(a));

  const firstHalf = sortByDescTotal(
    beforeHT.filter((e) => e.type !== MatchEventType.HalfTime),
  );
  const secondHalf = sortByDescTotal(
    betweenHTFT.filter((e) => e.type !== MatchEventType.FinalTime),
  );
  const overtimeSorted = sortByDescTotal(overtime);

  // Penaltis: mantener orden de llegada (P1, P2, …). Si quieres al revés, invierte el array.
  const penalties = rawPens.slice().reverse();

  const breaks = actions.filter((a) => a.type === MatchEventType.HalfTime);
  const finals = actions.filter((a) => a.type === MatchEventType.FinalTime);

  return {
    firstHalf,
    secondHalf,
    breaks,
    finals,
    overtime: overtimeSorted,
    penalties, // ← usa este grupo para pintar la tanda
  };
}
