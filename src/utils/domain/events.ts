import {
  ActionGroups,
  FINAL_STATUSES,
  FINISHED_MATCH_STATUSES,
  MatchData,
  MatchEvent,
  MatchEventKind,
  MatchEventSide,
  MatchEventType,
  MatchStatus,
  NOT_STARTED_STATUSES,
  ParsedMinute,
} from '@/types/domain/events';
import { PredictionGroup, PredictionView } from '@/types/domain/prediction';
import { getTimestamp } from '../common/date';

export const CANCELED: MatchStatus[] = ['Canc.', 'Susp.'];
export const IS_FINISHED: MatchStatus[] = ['FT', 'AET', 'AP', 'Canc.', 'Susp.'];

export function isLive(status: MatchStatus) {
  const s = String(status);
  return !(s === 'NS' || isFinished(status));
}

export function isFinished(status: MatchStatus) {
  const normalizedStatus = String(status) as MatchStatus;
  return (
    IS_FINISHED.includes(normalizedStatus) ||
    CANCELED.includes(normalizedStatus)
  );
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

    return (
      getTimestamp(a.kickoffIso ?? a.kickoff) -
      getTimestamp(b.kickoffIso ?? b.kickoff)
    );
  });
};

export function parseMinute(
  minute: number | string | null | undefined,
): ParsedMinute {
  if (minute == null) return { min: 0, extra: 0, total: 0, label: '' };

  const s = String(minute).trim().replace("'", '');

  if (s.includes('+')) {
    const [mm, ee] = s.split('+');
    const min = Number(mm) || 0;
    const ex = Number(ee) || 0;
    return { min, extra: ex, total: min + ex, label: `${min}+${ex}'` };
  }

  const min = Number(s) || 0;
  return {
    min,
    extra: 0,
    total: min,
    label: `${min}'`,
  };
}

export type ActionViewMode = 'key' | 'all';

export type TimelineRow =
  | {
      id: string;
      rowType: 'section';
      title: string;
    }
  | {
      id: string;
      rowType: 'event';
      event: MatchEvent;
    }
  | {
      id: string;
      rowType: 'marker';
      title: string;
      score?: {
        home: number;
        away: number;
      };
    }
  | {
      id: string;
      rowType: 'summary';
      label: string;
    };

type TimelineBucketKey = 'firstHalf' | 'secondHalf' | 'extraTime' | 'penalties';

const POST_HALFTIME_STATUSES = new Set<MatchStatus | string>([
  '2H',
  'HT',
  'FT',
  'AET',
  'AP',
  'Pen',
  'OT',
]);

export const getEventKind = (event: MatchEvent): MatchEventKind => {
  if (event.kind) return event.kind;

  switch (String(event.type)) {
    case MatchEventType.Goal:
    case MatchEventType.PenaltyGoal:
    case 'Goal':
    case 'PenaltyGoal':
      return 'goal';
    case MatchEventType.MissedPenalty:
    case MatchEventType.FailedPenalty:
    case 'FailedPenalty':
    case 'MissedPenalty':
      return 'missed_penalty';
    case MatchEventType.Card:
    case 'Card':
      return 'card';
    case MatchEventType.Substitution:
    case 'Substitution':
      return 'substitution';
    case MatchEventType.AddedTime:
    case 'AddedTime':
      return 'added_time';
    case MatchEventType.Half:
    case 'Half':
      return 'period';
    case 'Var':
    case 'VAR':
      return 'var';
    default:
      return 'other';
  }
};

export const getEventSide = (event: MatchEvent): MatchEventSide => {
  if (event.side) return event.side;
  if (event.isHome === true) return 'home';
  if (event.isHome === false) return 'away';
  return 'neutral';
};

export const isKeyMatchEvent = (event: MatchEvent): boolean => {
  const kind = getEventKind(event);

  if (event.isPenaltyShootout) return true;
  if (event.isCancelled) return true;

  return (
    kind === 'goal' ||
    kind === 'missed_penalty' ||
    kind === 'card' ||
    kind === 'var' ||
    kind === 'period'
  );
};

const getEventSortValue = (event: MatchEvent, index: number): number => {
  const parsedMinute = parseMinute(event.timeStr ?? event.minute);
  const kind = getEventKind(event);

  let offset = 1;
  if (kind === 'added_time') offset = 2;
  if (kind === 'period') offset = 3;

  return parsedMinute.total * 10 + offset + index / 1000;
};

const isFinalPeriodLabel = (label?: string | null) => {
  const normalized = String(label ?? '').toUpperCase();
  return normalized === 'FT' || normalized === 'AET' || normalized === 'AP';
};

const getBucketForEvent = (event: MatchEvent): TimelineBucketKey => {
  if (event.isPenaltyShootout) return 'penalties';

  const parsedMinute = parseMinute(event.timeStr ?? event.minute);
  if (parsedMinute.min > 90) return 'extraTime';
  if (parsedMinute.min > 45) return 'secondHalf';
  return 'firstHalf';
};

const parseScoreFromResult = (result?: string) => {
  if (!result || !result.includes('-')) return undefined;

  const [homeRaw, awayRaw] = result.split('-', 2);
  const home = Number(homeRaw);
  const away = Number(awayRaw);

  if (Number.isNaN(home) || Number.isNaN(away)) return undefined;
  return { home, away };
};

const summarizeHiddenEvents = (events: MatchEvent[]): string => {
  const substitutions = events.filter(
    (event) => getEventKind(event) === 'substitution',
  ).length;
  const addedTimes = events.filter(
    (event) => getEventKind(event) === 'added_time',
  ).length;

  if (events.length === substitutions) {
    return `+${substitutions} cambio${substitutions === 1 ? '' : 's'} oculto${substitutions === 1 ? '' : 's'}`;
  }

  if (events.length === addedTimes) {
    return `+${addedTimes} tiempo añadido oculto${addedTimes === 1 ? '' : 's'}`;
  }

  return `+${events.length} acciones secundarias`;
};

export const buildMatchTimelineRows = (
  match: MatchData,
  mode: ActionViewMode,
): TimelineRow[] => {
  const events = [...(match.events ?? [])]
    .map((event, index) => ({ event, index }))
    .sort((a, b) => getEventSortValue(a.event, a.index) - getEventSortValue(b.event, b.index))
    .map(({ event }) => event);

  const buckets: Record<
    TimelineBucketKey,
    { title: string; visible: MatchEvent[]; hidden: MatchEvent[] }
  > = {
    firstHalf: { title: '1ª parte', visible: [], hidden: [] },
    secondHalf: { title: '2ª parte', visible: [], hidden: [] },
    extraTime: { title: 'Prórroga', visible: [], hidden: [] },
    penalties: { title: 'Penaltis', visible: [], hidden: [] },
  };

  let halftimeMarker: MatchEvent | undefined;
  let finalMarker: MatchEvent | undefined;

  events.forEach((event) => {
    const kind = getEventKind(event);

    if (kind === 'period') {
      const label = String(event.label ?? '').toUpperCase();
      if (label === 'HT') {
        halftimeMarker = event;
        return;
      }

      if (isFinalPeriodLabel(label)) {
        finalMarker = event;
        return;
      }
    }

    const target = isKeyMatchEvent(event) || mode === 'all' ? 'visible' : 'hidden';
    buckets[getBucketForEvent(event)][target].push(event);
  });

  const rows: TimelineRow[] = [];
  const pushBucket = (key: TimelineBucketKey) => {
    const bucket = buckets[key];
    if (bucket.visible.length === 0 && bucket.hidden.length === 0) return;

    rows.push({
      id: `section-${key}`,
      rowType: 'section',
      title: bucket.title,
    });

    bucket.visible.forEach((event, index) => {
      rows.push({
        id: `${key}-event-${index}-${event.minute}-${String(event.type)}`,
        rowType: 'event',
        event,
      });
    });

    if (bucket.hidden.length > 0) {
      rows.push({
        id: `summary-${key}`,
        rowType: 'summary',
        label: summarizeHiddenEvents(bucket.hidden),
      });
    }
  };

  pushBucket('firstHalf');

  if (
    halftimeMarker ||
    POST_HALFTIME_STATUSES.has(match.status) ||
    parseMinute(match.minute).min > 45
  ) {
    rows.push({
      id: 'marker-halftime',
      rowType: 'marker',
      title: halftimeMarker?.title || 'Descanso',
      score: halftimeMarker?.score,
    });
  }

  pushBucket('secondHalf');
  pushBucket('extraTime');
  pushBucket('penalties');

  if (finalMarker || isFinished(match.status)) {
    rows.push({
      id: 'marker-final',
      rowType: 'marker',
      title: finalMarker?.title || 'Final',
      score: finalMarker?.score ?? parseScoreFromResult(match.result),
    });
  }

  return rows;
};

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

  const sortedEvents = [...events].sort((a, b) => a?.minute - b.minute);

  sortedEvents.forEach((event) => {
    const min = event.minute;

    if (event.type === 'Half' || event.type === MatchEventType.Half) {
      groups.breaks.push(event);
      return;
    }

    if (event.isPenaltyShootout) {
      groups.penalties.push(event);
      return;
    }

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
    const aKickoff =
      getTimestamp(a.kickoffIso ?? a.kickoff) || getTimestamp(a.createdAt);
    const bKickoff =
      getTimestamp(b.kickoffIso ?? b.kickoff) || getTimestamp(b.createdAt);

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
      (p) => getTimestamp(p.kickoffIso ?? p.kickoff) || getTimestamp(p.createdAt),
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

export const getTeamLogoSrc = (logo?: string | null) => logo || '/globe.svg';
