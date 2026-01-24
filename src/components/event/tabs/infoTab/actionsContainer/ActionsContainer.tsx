import {
  ActionGroups,
  FINAL_STATUSES,
  MatchData,
  MatchEvent,
} from '@/src/types/events/events.types';
import { ActionRow } from './actionRow/ActionRow';
import { TimelineDivider } from './actionRow/TimelineDivider';

interface ActionsContainerProps {
  event: MatchData;
  groups: ActionGroups;
}

export const ActionsContainer: React.FC<ActionsContainerProps> = ({
  event,
  groups,
}) => {
  const status = event.status;
  const { firstHalf, secondHalf, overtime, penalties } = groups;

  const isHalvesEvent = (ev: MatchEvent) => ev.type !== 46 && ev.type !== 47;

  //______DIVIDERS
  const showFinalDivider = FINAL_STATUSES.includes(status);

  const showHalftimeDivider = secondHalf.some(isHalvesEvent) || status > '45';
  const showOvertimeDivider =
    overtime?.some(isHalvesEvent) || (penalties && penalties?.length > 0);

  return (
    <div className="px-4 py-2 lg:px-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-text">
        Acciones del partido
      </h2>

      <div>
        {showFinalDivider && <TimelineDivider title="Final" />}

        {penalties?.length ? (
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
        ) : null}

        {showOvertimeDivider && <TimelineDivider title="Prórroga" />}

        {secondHalf.length > 0 && (
          <TimelineDivider>
            {secondHalf.filter(isHalvesEvent).map((ev, i) => (
              <ActionRow key={`sh-${i}`} matchEvent={ev} event={event} />
            ))}
          </TimelineDivider>
        )}

        {showHalftimeDivider && <TimelineDivider title="Descanso" />}

        {firstHalf.length > 0 && (
          <TimelineDivider>
            {firstHalf.filter(isHalvesEvent).map((ev, i) => (
              <ActionRow key={`fh-${i}`} matchEvent={ev} event={event} />
            ))}
          </TimelineDivider>
        )}

        <TimelineDivider title="Inicio" />
      </div>
    </div>
  );
};
