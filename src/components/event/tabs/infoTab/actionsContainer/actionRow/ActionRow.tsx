'use client';

import { MatchEvent } from '@/types/domain/events';
import {
  getEventKind,
  getEventSide,
  parseMinute,
} from '@/utils/domain/events';
import React from 'react';
import { EventIcons } from '../../EventIcons';
import { MinuteBadge } from './MinuteBadge';

interface ActionRowProps {
  matchEvent: MatchEvent;
}

const formatScore = (score?: { home: number; away: number }) => {
  if (!score) return null;
  return `${score.home}-${score.away}`;
};

const getPrimaryText = (matchEvent: MatchEvent) => {
  const kind = getEventKind(matchEvent);

  if (matchEvent.title) return matchEvent.title;

  if (kind === 'substitution') {
    return matchEvent.playerIn || 'Cambio';
  }

  if (kind === 'added_time') {
    return matchEvent.label || 'Tiempo añadido';
  }

  if (kind === 'period') {
    return matchEvent.label || 'Parte';
  }

  return matchEvent.player || matchEvent.label || 'Acción';
};

const getSecondaryText = (matchEvent: MatchEvent) => {
  if (matchEvent.subtitle) return matchEvent.subtitle;

  const kind = getEventKind(matchEvent);

  if (kind === 'goal' && matchEvent.assist) {
    return `Asist. ${matchEvent.assist}`;
  }

  if (kind === 'goal' && matchEvent.ownGoal) {
    return 'Gol en propia';
  }

  if (kind === 'goal' && matchEvent.isPenalty && !matchEvent.isPenaltyShootout) {
    return 'De penalti';
  }

  if (kind === 'card') {
    if (matchEvent.cardType === 'Red') {
      return 'Tarjeta roja';
    }

    if (matchEvent.cardType === 'YellowRed') {
      return 'Doble amarilla';
    }

    return 'Tarjeta amarilla';
  }

  if (kind === 'missed_penalty') {
    return 'Penalti fallado';
  }

  if (kind === 'substitution' && matchEvent.playerOut) {
    return `Sale ${matchEvent.playerOut}`;
  }

  return undefined;
};

const getDetailText = (matchEvent: MatchEvent) => {
  const kind = getEventKind(matchEvent);

  if (kind === 'var') {
    return matchEvent.detail;
  }

  if (matchEvent.subtitle && matchEvent.detail) {
    return matchEvent.detail;
  }

  return undefined;
};

const SideContent = ({
  align,
  title,
  subtitle,
  detail,
  score,
  isCancelled,
}: {
  align: 'left' | 'right';
  title: string;
  subtitle?: string;
  detail?: string;
  score?: string | null;
  isCancelled?: boolean;
}) => (
  <div
    className={`min-w-0 rounded-2xl border border-border/70 bg-surface/70 px-3 py-2 ${
      align === 'right' ? 'text-right' : 'text-left'
    }`}
  >
    <div
      className={`truncate text-sm font-semibold text-text ${
        isCancelled ? 'line-through decoration-text/60' : ''
      }`}
      title={title}
    >
      {title}
    </div>
    {subtitle && (
      <div className="mt-0.5 truncate text-xs text-muted" title={subtitle}>
        {subtitle}
      </div>
    )}
    {detail && (
      <div className="mt-0.5 truncate text-[11px] text-muted/80" title={detail}>
        {detail}
      </div>
    )}
    {score && (
      <div
        className={`mt-2 inline-flex rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand ${
          align === 'right' ? 'ml-auto' : ''
        }`}
      >
        {score}
      </div>
    )}
  </div>
);

const NeutralContent = ({
  title,
  subtitle,
  detail,
  matchEvent,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  matchEvent: MatchEvent;
}) => (
  <div className="flex justify-center">
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-4 py-2 text-center">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background">
        <EventIcons
          type={matchEvent.type}
          kind={getEventKind(matchEvent)}
          cardType={matchEvent.cardType}
        />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-text">
          {title}
        </span>
        {subtitle && (
          <span className="block truncate text-xs text-muted">{subtitle}</span>
        )}
        {detail && (
          <span className="block truncate text-[11px] text-muted/80">
            {detail}
          </span>
        )}
      </span>
    </div>
  </div>
);

export const ActionRow: React.FC<ActionRowProps> = ({ matchEvent }) => {
  const kind = getEventKind(matchEvent);
  const side = getEventSide(matchEvent);
  const minuteLabel = parseMinute(matchEvent.timeStr ?? matchEvent.minute).label;
  const title = getPrimaryText(matchEvent);
  const subtitle = getSecondaryText(matchEvent);
  const detail = getDetailText(matchEvent);
  const score =
    kind === 'goal' || matchEvent.isPenaltyShootout
      ? formatScore(matchEvent.score)
      : null;

  if (side === 'neutral' || kind === 'added_time') {
    return (
      <div className="py-1">
        <NeutralContent
          title={title}
          subtitle={subtitle}
          detail={detail}
          matchEvent={matchEvent}
        />
      </div>
    );
  }

  const leftContent =
    side === 'home' ? (
      <SideContent
        align="right"
        title={title}
        subtitle={subtitle}
        detail={detail}
        score={score}
        isCancelled={matchEvent.isCancelled && kind !== 'var'}
      />
    ) : (
      <div />
    );

  const rightContent =
    side === 'away' ? (
      <SideContent
        align="left"
        title={title}
        subtitle={subtitle}
        detail={detail}
        score={score}
        isCancelled={matchEvent.isCancelled && kind !== 'var'}
      />
    ) : (
      <div />
    );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_4.25rem_minmax(0,1fr)] items-start gap-3 py-1">
      {leftContent}

      <div className="flex flex-col items-center gap-2">
        <MinuteBadge label={minuteLabel || `${matchEvent.minute}'`} />
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-text shadow-sm">
          <EventIcons
            type={matchEvent.type}
            kind={kind}
            cardType={matchEvent.cardType}
          />
        </div>
      </div>

      {rightContent}
    </div>
  );
};
