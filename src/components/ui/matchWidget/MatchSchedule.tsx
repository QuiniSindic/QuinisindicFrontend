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

  // LÓGICA PARA PARTIDOS EN VIVO
  if (isLive) {
    // Si el campo minute tiene información (ej: "HT", "45", "90+2")
    if (event.minute) {
      const isHT = event.minute === 'HT';

      return (
        <p className={`${baseTextCls} font-bold text-brand animate-pulse`}>
          {isHT ? 'Descanso' : `${event.minute}'`}
        </p>
      );
    }
    // Backup si está en LIVE pero el minuto es NULL
    return <p className={`${baseTextCls} font-bold text-brand`}>En vivo</p>;
  }

  // LÓGICA PARA FINALIZADOS
  if (isFinished || event.status === 'FT') {
    return <p className={baseTextCls}>Finalizado</p>;
  }

  // POR DEFECTO: Mostrar fecha (Partidos NS)
  return <p className={baseTextCls}>{dateFormatted}</p>;
};
