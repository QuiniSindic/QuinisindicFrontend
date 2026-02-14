import EventTeamsData from '@/components/ui/matchWidget/EventTeamsData';
import { MatchSchedule } from '@/components/ui/matchWidget/MatchSchedule';
import { MatchData } from '@/types/domain/events';
import LiveBadge from './LiveBadge';

interface MatchWidgetProps {
  event: MatchData;
  isLive?: boolean;
  isFinished?: boolean;
}

export default function MatchWidget({
  event,
  isLive = false,
  isFinished = false,
}: MatchWidgetProps) {
  const showScore = isFinished || isLive;
  const minuteRaw = event.minute ? String(event.minute).trim() : '';
  const isHT = minuteRaw === 'HT';
  const normalizedMinute = minuteRaw.replace(/'+$/, '');
  const liveBadgeLabel = isLive
    ? isHT
      ? 'Descanso - En vivo'
      : normalizedMinute
        ? `${normalizedMinute} - En vivo`
        : 'En vivo'
    : 'En vivo';
  const containerClass = `
    relative mb-4 p-3 md:p-4 rounded-lg cursor-pointer w-full max-w-[560px] mx-auto
    bg-surface text-text border border-border shadow-sm
    transition-all duration-200
    sm:hover:shadow-lg sm:hover:scale-[1.02]
    active:scale-[0.98] sm:active:scale-100
    flex flex-col items-stretch
  `;

  return (
    <div className={containerClass}>
      <EventTeamsData event={event} showScore={showScore} />

      {isLive ? (
        <div className="mt-3 w-full flex justify-center">
          <LiveBadge label={liveBadgeLabel} />
        </div>
      ) : (
        <div className="mt-3 sm:mt-4 w-full flex justify-center">
          <MatchSchedule
            isLive={isLive}
            isFinished={isFinished}
            event={event}
            date={event.kickoff}
          />
        </div>
      )}
    </div>
  );
}
