'use client';

import { MatchData, MatchEvent } from '@/src/types/events/events.types';
import { makeActionGroupsForMatch } from '@/src/utils/events.utils';
import React from 'react';
import { ActionsContainer } from './actionsContainer/ActionsContainer';

interface MatchInfoProps {
  event: MatchData;
  isInProgress?: boolean;
  notStarted?: boolean;
  isFinished?: boolean;
}

export const MatchInfoTab: React.FC<MatchInfoProps> = ({ event }) => {
  const actions = event?.events;
  const isEmpty =
    actions?.length === 0 ||
    actions === undefined ||
    actions === null ||
    !actions;

  const groups = makeActionGroupsForMatch(actions as MatchEvent[]);

  if (isEmpty) {
    return (
      <div className="px-4 py-2">
        <h1 className="text-2xl font-bold text-center mb-2 text-text">
          Acciones de partido
        </h1>
        <p className="text-center text-muted">No hay acciones registradas.</p>
      </div>
    );
  }

  return <ActionsContainer event={event} groups={groups} />;
};
