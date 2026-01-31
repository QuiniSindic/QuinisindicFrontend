import { MatchData } from '@/types/events/events.types';
import { ScoreBadgeForm } from './ScoreBadgeForm';
import { StatusBadgeForm } from './StatusBadgeForm';
import { TeamBadgeForm } from './TeamBadgeForm';

interface TeamHeaderProps {
  event: MatchData;
}

export default function TeamHeader({ event }: TeamHeaderProps) {
  const home = event.homeTeam;
  const away = event.awayTeam;

  return (
    <div className="w-full">
      <div className="flex justify-center mb-3">
        <StatusBadgeForm event={event} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <TeamBadgeForm team={home} />

        <div className="flex justify-center">
          <ScoreBadgeForm score={event.result || undefined} />
        </div>

        <TeamBadgeForm team={away} />
      </div>
    </div>
  );
}
