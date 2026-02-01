'use client';
import {
  MatchData,
  MatchEvent,
  MatchEventType,
} from '@/types/events/events.types';
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
  // 1. MINUTO: Usamos timeStr ("45+2") o el minuto numérico
  // Ya no pasamos 'extraMinute' porque no existe en el tipo
  const rawMinute = matchEvent.timeStr || matchEvent.minute;
  const minute = parseMinute(rawMinute);

  // 2. EQUIPO:
  // Con el nuevo backend, 'isHome' debería venir siempre.
  // Si viniera undefined, por defecto asumimos local (o maneja el caso según prefieras)
  // Eliminamos el fallback a 'matchEvent.team' porque esa propiedad ya no existe.
  const isHome = matchEvent.isHome ?? true;

  const teamName = isHome ? event.homeTeam.name : event.awayTeam.name;

  // 3. ASISTENCIA: Usamos solo 'assist'
  const assistText = matchEvent.assist;
  const hasAssist = !!assistText && assistText !== '-';

  // 4. JUGADOR: Usamos solo 'player'
  const playerName = matchEvent.player;

  // 5. CAMBIO: Detectamos si es sustitución
  const isSub =
    matchEvent.type === MatchEventType.Substitution ||
    matchEvent.type === 'Substitution';
  const subIn = matchEvent.playerIn;
  const subOut = matchEvent.playerOut;

  return (
    <div
      className={`
        grid items-center gap-3 rounded-xl
        px-4 py-3 shadow-sm mb-3
        border border-border bg-surface/80 backdrop-blur-sm
        hover:bg-background hover:shadow-md transition
        ${isPenalties ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[auto_auto_1fr_auto]'} 
      `}
    >
      {!isPenalties && <MinuteBadge label={minute.label} />}

      <div className="shrink-0 flex items-center justify-center">
        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-background border border-border text-text overflow-hidden">
          <EventIcons type={matchEvent.type} />
        </div>
      </div>

      <ActionData
        // Lógica de visualización para cambios
        playerName={
          isSub && subIn ? `${subIn} (entra) por ${subOut}` : playerName
        }
        teamName={teamName}
        assist={hasAssist ? assistText : undefined}
      />

      <ScoreBadge score={matchEvent.score} />
    </div>
  );
};
