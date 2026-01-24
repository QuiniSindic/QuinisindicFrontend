import { MatchData } from '@/src/types/events/events.types';
import { formatMatchWidget } from '@/src/utils/date.utils';

interface MatchScheduleProps {
  date: string;
  isLive?: boolean;
  isFinished?: boolean;
  event: MatchData;
}

export const MatchSchedule = ({
  date,
  isLive,
  isFinished,
  event,
}: MatchScheduleProps) => {
  const dateFormatted = formatMatchWidget(date);

  const baseTextCls = 'text-muted text-sm md:text-base text-center';

  // regex minutos ("65'", "45+2", "90+3'", "105+1", etc.)
  const minuteMatch = event.status.match(/^(\d+)(?:\+(\d+))?'?$/);
  const isMinute = !!minuteMatch;

  // main minute (sin extra time)
  const mainMin = isMinute ? parseInt(minuteMatch![1], 10) : 0;

  // momento del partido
  //  0 - 45 -> FH
  //  46 - 90 -> SH
  //  91 - 105 -> OT 1
  //  >105 -> OT 2
  let phaseLabel = '';
  if (isMinute) {
    if (mainMin <= 45) {
      phaseLabel = 'Primera parte';
    } else if (mainMin <= 90) {
      phaseLabel = 'Segunda parte';
    } else if (mainMin <= 105) {
      phaseLabel = 'Prórroga (1ª parte)';
    } else {
      phaseLabel = 'Prórroga (2ª parte)';
    }
  }

  // apostrofe final
  const displayMinute = isMinute
    ? event.status.endsWith("'")
      ? event.status
      : `${event.status}'`
    : '';

  if (isLive) {
    if (isMinute) {
      return (
        <p className={baseTextCls}>
          {phaseLabel} {displayMinute}
        </p>
      );
    }
    switch (event.status) {
      case 'HT':
        return <p className={baseTextCls}>Descanso</p>;
      case 'Canc.':
        return <p className={baseTextCls}>Cancelado</p>;
      default:
        return <p className={baseTextCls}>{dateFormatted}</p>;
    }
  }

  if (isFinished) {
    return <p className={baseTextCls}>Finalizado</p>;
  }

  return <p className={baseTextCls}>{dateFormatted}</p>;
};
