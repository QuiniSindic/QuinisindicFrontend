import {
  ActionGroups,
  FINAL_STATUSES,
  MatchData,
  MatchEvent,
  MatchEventType,
  MatchStatus,
} from '@/types/domain/events';
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
  const { firstHalf, secondHalf, overtime, penalties, breaks } = groups;

  const isGameAction = (ev: MatchEvent) => ev.type !== MatchEventType.Half;

  const renderActions = (actions: MatchEvent[], prefix: string) => {
    return [...actions]
      .filter(isGameAction)
      .reverse() // Para que el minuto más alto salga arriba
      .map((ev, i) => (
        <ActionRow key={`${prefix}-${i}`} matchEvent={ev} event={event} />
      ));
  };

  // Helper para buscar un break específico (HT, FT)
  const getBreakLabel = (label: string) =>
    breaks.find((b) => b.label === label);

  return (
    <div className="px-4 py-2 lg:px-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-text">
        Acciones del partido
      </h2>

      <div className="flex flex-col gap-0">
        {/* 1. FINAL (Si existe el evento o el estado es final) */}
        {(getBreakLabel('FT') || FINAL_STATUSES.includes(status as any)) && (
          <TimelineDivider title="Final" />
        )}

        {/* 2. PENALTIS */}
        {penalties && penalties.length > 0 && (
          <div className="flex flex-col-reverse">
            {penalties.map((ev, i) => (
              <ActionRow
                key={`pen-${i}`}
                matchEvent={ev}
                event={event}
                isPenalties
              />
            ))}
            <TimelineDivider title="Penaltis" />
          </div>
        )}

        {/* 3. PRÓRROGA */}
        {renderActions(overtime || [], 'ot')}
        {overtime && overtime.length > 0 && (
          <TimelineDivider title="Prórroga" />
        )}

        {/* 4. SEGUNDA PARTE */}
        {renderActions(secondHalf, 'sh')}

        {/* 5. DESCANSO (Ahora usamos el dato de groups.breaks) */}
        {(getBreakLabel('HT') || isPastHalftime(status)) && (
          <TimelineDivider title="Descanso" />
        )}

        {/* 6. PRIMERA PARTE */}
        {renderActions(firstHalf, 'fh')}

        {/* 7. INICIO */}
        <TimelineDivider title="Inicio" />
      </div>
    </div>
  );
};
