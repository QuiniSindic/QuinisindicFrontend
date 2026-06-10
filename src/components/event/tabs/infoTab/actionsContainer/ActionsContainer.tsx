'use client';

import { MatchData } from '@/types/domain/events';
import {
  ActionViewMode,
  TimelineRow,
  buildMatchTimelineRows,
} from '@/utils/domain/events';
import React, { useState } from 'react';
import { ActionRow } from './actionRow/ActionRow';
import { TimelineDivider } from './actionRow/TimelineDivider';

interface ActionsContainerProps {
  event: MatchData;
}

const VIEW_MODES: Array<{ id: ActionViewMode; label: string }> = [
  { id: 'key', label: 'Claves' },
  { id: 'all', label: 'Todo' },
];

const formatScore = (score?: { home: number; away: number }) => {
  if (!score) return null;
  return `${score.home}-${score.away}`;
};

const MarkerRow = ({
  title,
  score,
}: {
  title: string;
  score?: { home: number; away: number };
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-1">
    <div className="h-px bg-border/70" />
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
      <span>{title}</span>
      {score && (
        <span className="rounded-full border border-brand/20 bg-brand/10 px-2 py-0.5 text-brand">
          {formatScore(score)}
        </span>
      )}
    </div>
    <div className="h-px bg-border/70" />
  </div>
);

const SummaryRow = ({ label }: { label: string }) => (
  <div className="flex justify-center py-1">
    <span className="rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-xs font-medium text-muted">
      {label}
    </span>
  </div>
);

const renderRow = (row: TimelineRow) => {
  if (row.rowType === 'section') {
    return <TimelineDivider key={row.id} title={row.title} />;
  }

  if (row.rowType === 'marker') {
    return <MarkerRow key={row.id} title={row.title} score={row.score} />;
  }

  if (row.rowType === 'summary') {
    return <SummaryRow key={row.id} label={row.label} />;
  }

  return <ActionRow key={row.id} matchEvent={row.event} />;
};

export const ActionsContainer: React.FC<ActionsContainerProps> = ({ event }) => {
  const [viewMode, setViewMode] = useState<ActionViewMode>('key');
  const rows = buildMatchTimelineRows(event, viewMode);

  return (
    <div className="px-1 py-1 sm:px-2">
      <div className="mb-4 flex items-center justify-center">
        <div className="inline-flex rounded-full border border-border bg-surface/80 p-1 shadow-sm">
          {VIEW_MODES.map((mode) => {
            const isActive = mode.id === viewMode;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id)}
                className={`min-w-24 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand text-brand-contrast shadow-sm'
                    : 'text-muted hover:bg-background'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => renderRow(row))}
      </div>
    </div>
  );
};
