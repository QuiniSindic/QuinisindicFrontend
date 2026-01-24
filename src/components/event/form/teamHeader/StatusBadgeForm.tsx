import { MatchData } from '@/src/types/events/events.types';
import { formatKickoffBadge } from '@/src/utils/date.utils';

//CHECK: refactor paleta de colores si es necesario
export const StatusBadgeForm = ({ event }: { event: MatchData }) => {
  const s = event.status ?? '';
  const isNS = s === 'NS';
  const isHT = s === 'HT';
  const isFT = s === 'FT' || s === 'AET' || s === 'AP';
  const isLive = !isNS && !isFT && !isHT; // p.ej. "45'", "90+2'"

  if (isLive) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-3 h-7 text-xs font-semibold"
        title="El partido está en juego"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
        </span>
        En juego • {s.replace(/'/g, '′')}
      </span>
    );
  }
  if (isHT) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 h-7 text-xs font-semibold">
        Descanso
      </span>
    );
  }
  if (isFT) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-500/10 text-gray-700 dark:text-gray-300 px-3 h-7 text-xs font-semibold">
        Finalizado
      </span>
    );
  }

  const label = formatKickoffBadge(event.kickoff);
  // NS
  return (
    <span className="inline-flex items-center rounded-full bg-secondary/10 text-secondary px-3 h-7 text-xs font-semibold">
      {label ? (
        <>
          <time dateTime={new Date(event.kickoff).toISOString()}>{label}h</time>
        </>
      ) : (
        'Empieza pronto'
      )}
    </span>
  );
};
