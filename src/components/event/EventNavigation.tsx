'use client';

import { useUpcomingEventsQuery } from '@/hooks/useUpcomingEvents';
import { FINAL_STATUSES, MatchData } from '@/types/domain/events';
import { isFinished, isLive } from '@/utils/domain/events';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface EventNavigationProps {
  currentId: number;
  events?: MatchData[];
  returnTo?: string;
}

const formatKickoffLabel = (kickoff?: string) => {
  if (!kickoff) return 'Detalle del partido';

  const parsed = dayjs(kickoff);
  if (!parsed.isValid()) return 'Detalle del partido';

  const formatted = parsed.locale('es').format('dddd DD/MM/YY HH:mm');
  return `${formatted.charAt(0).toUpperCase()}${formatted.slice(1)}`;
};

export default function EventNavigation({
  currentId,
  events = [],
  returnTo,
}: EventNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('ctxMode') as 'events' | 'results' | null;
  const ctxStatus = searchParams.get('ctxStatus') as
    | 'all'
    | 'live'
    | 'upcoming'
    | null;
  const sportIdRaw = Number(searchParams.get('ctxSportId'));
  const competitionIdRaw = Number(searchParams.get('ctxCompetitionId'));
  const fromDate = searchParams.get('ctxFrom');
  const toDate = searchParams.get('ctxTo');

  const sportId =
    Number.isInteger(sportIdRaw) && sportIdRaw > 0 ? sportIdRaw : undefined;
  const competitionId =
    Number.isInteger(competitionIdRaw) && competitionIdRaw > 0
      ? competitionIdRaw
      : undefined;

  const { data: contextEventsByCompetition } = useUpcomingEventsQuery(
    sportId,
    competitionId,
    fromDate,
    toDate,
    { refetchInterval: 1000 * 60 },
  );

  const contextEventsRaw =
    contextEventsByCompetition?.flatMap((competition) => competition.matches) ??
    [];

  const contextEvents = (() => {
    if (contextEventsRaw.length === 0) return [];

    let filtered = [...contextEventsRaw];

    if (mode === 'results') {
      filtered = filtered.filter((event) => isFinished(event.status));
    } else if (mode === 'events') {
      filtered = filtered.filter((event) => !isFinished(event.status));
      if (ctxStatus === 'live') {
        filtered = filtered.filter((event) => isLive(event.status));
      } else if (ctxStatus === 'upcoming') {
        filtered = filtered.filter((event) => !isLive(event.status));
      }
    }

    return filtered.sort(
      (a, b) => dayjs(a.kickoff).valueOf() - dayjs(b.kickoff).valueOf(),
    );
  })();

  const sourceEvents = contextEvents.some((event) => event.id === currentId)
    ? contextEvents
    : events;

  if (!sourceEvents || sourceEvents.length === 0) return null;

  const fallbackReturn = returnTo || '/home';
  const orderedEvents = [...sourceEvents].sort((a, b) => {
    const aTs = dayjs(a.kickoff).valueOf();
    const bTs = dayjs(b.kickoff).valueOf();

    if (Number.isNaN(aTs) || Number.isNaN(bTs)) return a.id - b.id;
    return aTs - bTs;
  });
  const nsEvents = orderedEvents.filter((event) => event.status === 'NS');
  const navigationEvents = nsEvents.some((event) => event.id === currentId)
    ? nsEvents
    : orderedEvents;
  const currentIndex = navigationEvents.findIndex(
    (event) => event.id === currentId,
  );
  const currentEvent =
    currentIndex >= 0 ? navigationEvents[currentIndex] : undefined;
  const previousEvent =
    currentIndex > 0 ? navigationEvents[currentIndex - 1] : null;
  const nextEvent =
    currentIndex >= 0 && currentIndex < navigationEvents.length - 1
      ? navigationEvents[currentIndex + 1]
      : null;
  const shouldIncludeReturnTo = !!returnTo && returnTo !== '/home';
  const isLiveMatch =
    !!currentEvent &&
    currentEvent.status !== 'NS' &&
    !FINAL_STATUSES.has(currentEvent.status);

  const centerLabel = isLiveMatch
    ? formatKickoffLabel(currentEvent?.kickoff)
    : undefined;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackReturn);
  };

  const buildEventHref = (eventId: number) => {
    const base = `/event/${eventId}`;
    const params = new URLSearchParams(searchParams.toString());
    if (shouldIncludeReturnTo) {
      params.set('returnTo', returnTo as string);
    } else {
      params.delete('returnTo');
    }
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  const handlePrevious = () => {
    if (previousEvent) {
      router.push(buildEventHref(previousEvent.id));
      return;
    }

    handleBack();
  };

  const handleNext = () => {
    if (!nextEvent) return;
    router.push(buildEventHref(nextEvent.id));
  };

  return (
    <div className="sticky top-(--header-h) z-30 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/70 border-b border-border/60">
      <div className="mx-3 sm:mx-4 py-2 grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label={previousEvent ? 'Partido anterior' : 'Volver'}
          className="
            inline-flex items-center justify-center
            h-10 w-10 rounded-lg
            bg-surface text-text text-sm font-medium
            border border-border
            hover:bg-background
            transition-colors
            hover:border-brand hover:text-brand
          "
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="text-xs text-muted text-center whitespace-nowrap overflow-hidden text-ellipsis px-2 flex justify-center">
          {currentEvent?.status === 'NS' ? (
            <button
              type="button"
              onClick={() => router.push(fallbackReturn)}
              className="
                h-8 px-3 rounded-lg border border-border text-sm
                bg-surface hover:bg-background transition-colors
              "
            >
              Salir
            </button>
          ) : (
            centerLabel
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={!nextEvent}
          aria-label="Partido siguiente"
          className="
            inline-flex items-center justify-center
            h-10 w-10 rounded-lg
            bg-surface text-text text-sm font-medium
            border border-border
            hover:bg-background
            transition-colors
            hover:border-brand hover:text-brand
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
