import { MatchData } from '@/types/domain/events';
import { formatMatchWidget } from '@/utils/common/date';

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

  if (isLive) {
    if (event.minute) {
      const rawMinute = String(event.minute).trim();
      const isHT = rawMinute === 'HT';
      const normalizedMinute = rawMinute.replace(/'+$/, '');

      return (
        <p className={`${baseTextCls} font-bold text-brand`}>
          {isHT ? 'Descanso' : `${normalizedMinute}`}
        </p>
      );
    }

    return <p className={`${baseTextCls} font-bold text-brand`}>En vivo</p>;
  }

  if (isFinished || event.status === 'FT') {
    return <p className={baseTextCls}>Finalizado</p>;
  }

  return <p className={baseTextCls}>{dateFormatted}</p>;
};
