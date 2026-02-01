import {
  ActionGroups,
  FINAL_STATUSES,
  MatchData,
  MatchEvent,
  MatchEventType,
  MatchStatus,
} from '@/types/events/events.types';
import React from 'react';
import { ActionRow } from './actionRow/ActionRow';
import { TimelineDivider } from './actionRow/TimelineDivider';

interface ActionsContainerProps {
  event: MatchData;
  groups: ActionGroups;
}

// Helper para saber si ya hemos pasado el descanso
const isPastHalftime = (status: MatchStatus) => {
  const s = String(status);
  const postHalftimeStatuses = ['2H', 'HT', 'FT', 'AET', 'AP', 'Pen', 'OT'];
  return postHalftimeStatuses.includes(s);
};

export const ActionsContainer: React.FC<ActionsContainerProps> = ({
  event,
  groups,
}) => {
  const status = event.status;
  const { firstHalf, secondHalf, overtime, penalties } = groups;

  // Filtro para ignorar marcadores de tiempo en la lista visual
  const isGameAction = (ev: MatchEvent) =>
    ev.type !== MatchEventType.Half && ev.type !== MatchEventType.AddedTime;

  // ______ LOGICA DE DIVISORES ______

  const showFinalDivider = FINAL_STATUSES.includes(status as any);

  // Mostrar descanso si hay acciones en la 2ª parte o si el estado es posterior al descanso
  const showHalftimeDivider =
    secondHalf.some(isGameAction) || isPastHalftime(status);

  // Mostrar prórroga si hay eventos de OT o Penaltis
  const showOvertimeDivider =
    (overtime && overtime.some(isGameAction)) ||
    (penalties && penalties.length > 0);

  return (
    <div className="px-4 py-2 lg:px-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-text">
        Acciones del partido
      </h2>

      <div className="flex flex-col gap-0">
        {/* --- FINAL --- */}
        {showFinalDivider && <TimelineDivider title="Final" />}

        {/* --- PENALTIS --- */}
        {penalties && penalties.length > 0 && (
          <TimelineDivider title="Penaltis" position="footer">
            {penalties.map((ev, i) => (
              <ActionRow
                key={`pen-${i}`}
                matchEvent={ev}
                event={event}
                isPenalties={true}
              />
            ))}
          </TimelineDivider>
        )}

        {/* --- PRÓRROGA --- */}
        {overtime && overtime.length > 0 && (
          <>
            {showOvertimeDivider && <TimelineDivider title="Prórroga" />}
            {overtime.filter(isGameAction).map((ev, i) => (
              <ActionRow key={`ot-${i}`} matchEvent={ev} event={event} />
            ))}
          </>
        )}

        {/* --- SEGUNDA PARTE --- */}
        {secondHalf.length > 0 && (
          <div className="contents">
            {secondHalf.filter(isGameAction).map((ev, i) => (
              <ActionRow key={`sh-${i}`} matchEvent={ev} event={event} />
            ))}
          </div>
        )}

        {/* --- DESCANSO --- */}
        {showHalftimeDivider && <TimelineDivider title="Descanso" />}

        {/* --- PRIMERA PARTE --- */}
        {firstHalf.length > 0 && (
          <div className="contents">
            {firstHalf.filter(isGameAction).map((ev, i) => (
              <ActionRow key={`fh-${i}`} matchEvent={ev} event={event} />
            ))}
          </div>
        )}

        {/* --- INICIO --- */}
        <TimelineDivider title="Inicio" />
      </div>
    </div>
  );
};
