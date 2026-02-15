import {
  ActionGroups,
  FINAL_STATUSES,
  FINISHED_MATCH_STATUSES,
  MatchData,
  MatchEvent,
  MatchEventType,
  MatchStatus,
  NOT_STARTED_STATUSES,
  ParsedMinute,
} from '@/types/domain/events';
import { PredictionGroup, PredictionView } from '@/types/domain/prediction';
import dayjs from 'dayjs';
import { getTimestamp } from '../common/date';

export const CANCELED: MatchStatus[] = ['Canc.', 'Susp.'];
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

export type PredictionStatusFilter = 'all' | 'live' | 'ns' | 'finished';
export const getStatusBucket = (status: string): PredictionStatusFilter => {
  if (NOT_STARTED_STATUSES.has(status)) return 'ns';
  if (FINAL_STATUSES.has(status)) return 'finished';
  return 'live';
};

type SortMode = 'status' | 'kickoff_desc' | 'kickoff_asc';

export const groupBySportAndLeague = (
  rows: PredictionView[],
  sortMode: SortMode,
): PredictionGroup[] => {
  const sportMap = new Map<number, PredictionGroup>();

  rows.forEach((row) => {
    if (!sportMap.has(row.sportId)) {
      sportMap.set(row.sportId, {
        sportId: row.sportId,
        sportName: row.sportName,
        leagues: [],
      });
    }

    const sportGroup = sportMap.get(row.sportId)!;
    const league = sportGroup.leagues.find(
      (item) => item.competitionId === row.competitionId,
    );

    if (league) {
      league.predictions.push(row);
    } else {
      sportGroup.leagues.push({
        competitionId: row.competitionId,
        competitionName: row.competitionName,
        predictions: [row],
      });
    }
  });

  const comparePredictions = (a: PredictionView, b: PredictionView) => {
    const aKickoff = getTimestamp(a.kickoff) || getTimestamp(a.createdAt);
    const bKickoff = getTimestamp(b.kickoff) || getTimestamp(b.createdAt);

    if (sortMode === 'kickoff_asc') {
      if (aKickoff !== bKickoff) return aKickoff - bKickoff;
      return a.id.localeCompare(b.id);
    }

    if (sortMode === 'kickoff_desc') {
      if (aKickoff !== bKickoff) return bKickoff - aKickoff;
      return a.id.localeCompare(b.id);
    }

    const statusOrder: Record<PredictionStatusFilter, number> = {
      live: 0,
      ns: 1,
      finished: 2,
      all: 3,
    };

    const byStatus =
      statusOrder[getStatusBucket(a.matchStatus)] -
      statusOrder[getStatusBucket(b.matchStatus)];

    if (byStatus !== 0) return byStatus;
    if (aKickoff !== bKickoff) return aKickoff - bKickoff;
    return a.id.localeCompare(b.id);
  };

  const resolveLeagueKey = (
    league: PredictionGroup['leagues'][number],
    direction: 'asc' | 'desc',
  ) => {
    const values = league.predictions.map(
      (p) => getTimestamp(p.kickoff) || getTimestamp(p.createdAt),
    );
    const filtered = values.filter((v) => v > 0);
    if (filtered.length === 0) return 0;
    return direction === 'asc' ? Math.min(...filtered) : Math.max(...filtered);
  };

  return Array.from(sportMap.values())
    .map((sport) => {
      const leagues = sport.leagues.map((league) => ({
        ...league,
        predictions: [...league.predictions].sort(comparePredictions),
      }));

      if (sortMode === 'kickoff_asc' || sortMode === 'kickoff_desc') {
        const direction = sortMode === 'kickoff_asc' ? 'asc' : 'desc';
        leagues.sort((a, b) => {
          const aKey = resolveLeagueKey(a, direction);
          const bKey = resolveLeagueKey(b, direction);

          if (aKey !== bKey) {
            return direction === 'asc' ? aKey - bKey : bKey - aKey;
          }

          return a.competitionName.localeCompare(b.competitionName);
        });
      } else {
        leagues.sort((a, b) =>
          a.competitionName.localeCompare(b.competitionName),
        );
      }

      return {
        ...sport,
        leagues,
      };
    })
    .sort((a, b) => {
      if (sortMode === 'kickoff_asc' || sortMode === 'kickoff_desc') {
        const direction = sortMode === 'kickoff_asc' ? 'asc' : 'desc';
        const aValues = a.leagues
          .map((l) => resolveLeagueKey(l, direction))
          .filter((v) => v > 0);
        const bValues = b.leagues
          .map((l) => resolveLeagueKey(l, direction))
          .filter((v) => v > 0);
        const aKey = aValues.length
          ? direction === 'asc'
            ? Math.min(...aValues)
            : Math.max(...aValues)
          : 0;
        const bKey = bValues.length
          ? direction === 'asc'
            ? Math.min(...bValues)
            : Math.max(...bValues)
          : 0;

        if (aKey !== bKey) {
          return direction === 'asc' ? aKey - bKey : bKey - aKey;
        }
      }

      return a.sportName.localeCompare(b.sportName);
    });
};

export const getStatusLabel = (status: string) => {
  const bucket = getStatusBucket(status);
  if (bucket === 'ns') return 'No iniciado';
  if (bucket === 'finished') return 'Finalizado';
  return 'En juego';
};

export const getResultDisplay = (prediction: PredictionView) => {
  const bucket = getStatusBucket(prediction.matchStatus);
  const hasLiveScore =
    typeof prediction.homeScore === 'number' &&
    typeof prediction.awayScore === 'number';

  if (bucket === 'ns') {
    return {
      label: 'Partido',
      value: 'Por empezar',
      tone: 'text-muted',
    };
  }

  if (bucket === 'live') {
    if (hasLiveScore) {
      const minute = prediction.minute ? ` (${prediction.minute})` : '';
      return {
        label: 'Resultado actual',
        value: `${prediction.homeScore} - ${prediction.awayScore}${minute}`,
        tone: 'text-brand',
      };
    }

    return {
      label: 'Resultado actual',
      value: 'En juego',
      tone: 'text-brand',
    };
  }

  if (hasLiveScore) {
    return {
      label: 'Resultado final',
      value: `${prediction.homeScore} - ${prediction.awayScore}`,
      tone: 'text-text',
    };
  }

  return {
    label: 'Resultado final',
    value: 'Sin resultado',
    tone: 'text-muted',
  };
};

export const getTeamName = (
  team: { name?: string } | null | undefined,
  fallback: string,
) => {
  if (!team?.name) return fallback;
  return team.name;
};

export const isFinishedMatchStatus = (status?: string | null): boolean => {
  if (!status) return false;
  return FINISHED_MATCH_STATUSES.includes(
    status as (typeof FINISHED_MATCH_STATUSES)[number],
  );
};
