'use client';
import { MatchData, MatchEvent, MatchEventType } from '@/types/domain/events';
import { parseMinute } from '@/utils/domain/events';
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
  const isAddedTime = matchEvent.type === 'AddedTime';

  // 1. TIEMPO: Priorizamos el label para el tiempo añadido
  const displayTime = isAddedTime
    ? matchEvent.label
    : parseMinute(matchEvent.timeStr || matchEvent.minute).label;

  // 2. EQUIPO: No mostramos equipo en tiempo añadido (opcional, según prefieras)
  const isHome = matchEvent.isHome ?? true;
  const teamName = isAddedTime
    ? undefined
    : isHome
      ? event.homeTeam.name
      : event.awayTeam.name;

  // 3. JUGADOR Y CAMBIOS
  const isSub =
    matchEvent.type === MatchEventType.Substitution ||
    matchEvent.type === 'Substitution';

  // Determinamos el nombre a mostrar:
  // Si es tiempo añadido -> vacío
  // Si es cambio -> lógica de In/Out
  // Si es normal -> matchEvent.player
  const finalPlayerName = isAddedTime
    ? ''
    : isSub && matchEvent.playerIn
      ? `${matchEvent.playerIn} (entra) por ${matchEvent.playerOut}`
      : matchEvent.player;

  const hasAssist = !!matchEvent.assist && matchEvent.assist !== '-';

  return (
    <div
      className={`
        grid items-center gap-3 rounded-xl px-4 py-3 shadow-sm mb-3
        border border-border bg-surface/80 backdrop-blur-sm
        hover:bg-background hover:shadow-md transition
        ${isPenalties ? 'grid-cols-[auto_1fr_auto]' : 'grid-cols-[auto_auto_1fr_auto]'} 
        ${isAddedTime ? 'opacity-90' : ''} 
      `}
    >
      {!isPenalties && <MinuteBadge label={displayTime as string} />}

      {/* Solo renderizamos el contenedor del icono si NO es tiempo añadido */}
      {!isAddedTime ? (
        <div className="shrink-0 flex items-center justify-center">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-background border border-border text-text overflow-hidden">
            <EventIcons type={matchEvent.type} cardType={matchEvent.cardType} />
          </div>
        </div>
      ) : (
        /* Div vacío para mantener el hueco del grid si prefieres, 
           o puedes ajustar el grid-cols dinámicamente */
        <div className="w-0" />
      )}

      <div
        className={`${isAddedTime ? 'flex justify-center text-center' : ''} min-w-0 flex-1`}
      >
        <ActionData
          playerName={finalPlayerName}
          teamName={teamName}
          assist={!isAddedTime && hasAssist ? matchEvent.assist : undefined}
        />
      </div>

      <ScoreBadge score={matchEvent.score} />
    </div>
  );
};
