import { MatchData } from '@/types/domain/events';
import Image from 'next/image';

interface EventTeamsProps {
  event: MatchData;
  showScore?: boolean;
  centerLabel?: string;
}

export default function EventTeamsData({
  event,
  showScore = false,
  centerLabel,
}: EventTeamsProps) {
  return (
    <>
      {/* Vista para PC (pantallas grandes) */}
      <div className="hidden sm:grid grid-cols-[1fr_40px_80px_40px_1fr] items-center mt-4">
        <span className="text-base font-medium text-right mt-2 text-text">
          {event.homeTeam.name}
        </span>

        <Image
          src={`${event.homeTeam.img as string}` || '/globe.svg'}
          alt={event.homeTeam.abbr}
          width={28}
          height={28}
          className="justify-self-end"
        />

        <div
          className={`text-center text-sm md:text-base ${
            showScore ? 'text-text font-semibold' : 'text-muted font-medium'
          }`}
        >
          {showScore ? event.result : (centerLabel ?? 'vs')}
        </div>

        <Image
          src={`${event.awayTeam.img as string}` || '/globe.svg'}
          alt={event.awayTeam.abbr}
          width={28}
          height={28}
          className="justify-self-start"
        />

        <span className="text-base font-medium text-left mt-2 text-text">
          {event.awayTeam.name}
        </span>
      </div>

      {/* Vista para móvil */}
      <div className="sm:hidden w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2 mt-2">
        <div className="min-w-0 flex items-center gap-2">
          <Image
            src={`${event.homeTeam.img as string}` || '/globe.svg'}
            alt={event.homeTeam.abbr}
            width={20}
            height={20}
          />
          <span className="text-sm font-medium text-text truncate">
            {event.homeTeam.name}
          </span>
        </div>

        <div
          className={`text-center text-sm px-2 ${
            showScore ? 'text-text font-semibold' : 'text-muted font-medium'
          }`}
        >
          {showScore ? event.result : (centerLabel ?? 'vs')}
        </div>

        <div className="min-w-0 flex items-center justify-end gap-2">
          <span className="text-sm font-medium text-text truncate text-right">
            {event.awayTeam.name}
          </span>
          <Image
            src={`${event.awayTeam.img as string}` || '/globe.svg'}
            alt={event.awayTeam.name}
            width={20}
            height={20}
          />
        </div>
      </div>
    </>
  );
}
