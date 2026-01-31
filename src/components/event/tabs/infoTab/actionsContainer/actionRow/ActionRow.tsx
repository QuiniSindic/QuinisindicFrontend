'use client';
import { MatchData, MatchEvent } from '@/types/events/events.types';
import { parseMinute } from '@/utils/events.utils';
import React from 'react';
import { EventIcons } from '../../EventIcons';
import { ActionData } from './ActionData';
import { MinuteBadge } from './MinuteBadge';
import { ScoreBadge } from './ScoreBadge';

interface ActionRowProps {
  matchEvent: MatchEvent;
  event: MatchData;
  isPenalties?: boolean;
}

export const ActionRow: React.FC<ActionRowProps> = ({
  matchEvent,
  event,
  isPenalties = false,
}) => {
  const minute = parseMinute(matchEvent.minute, matchEvent.extraMinute);
  const isHome = matchEvent.team === 1;
  const teamName = isHome ? event.homeTeam.name : event.awayTeam.name;
  const hasAssist = !!matchEvent.extra && matchEvent.extra !== '-';

  return (
    <div
      className={`
        grid items-center gap-3 rounded-xl
        px-4 py-3 shadow-sm
        border border-border bg-surface/80 backdrop-blur-sm
        hover:bg-background hover:shadow-md transition
        ${isPenalties ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[auto_auto_1fr_auto]'} 
      `}
    >
      {!isPenalties && <MinuteBadge label={minute.label} />}

      <div className="shrink-0 flex items-center justify-center">
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-background border border-border text-text">
          <EventIcons type={matchEvent.type} />
        </div>
      </div>

      <ActionData
        playerName={matchEvent.playerName}
        teamName={teamName}
        assist={hasAssist ? matchEvent.extra : undefined}
      />

      <ScoreBadge score={matchEvent.score} />
    </div>
  );
};
