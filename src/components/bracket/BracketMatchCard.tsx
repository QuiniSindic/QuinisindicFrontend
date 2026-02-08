'use client';

import { MatchData } from '@/types/domain/events';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  match: MatchData;
}

export const BracketMatchCard = ({ match }: Props) => {
  // Parsear resultado si existe (ej: "2-1")
  let homeScore = '-';
  let awayScore = '-';

  if (
    match.status === 'FT' ||
    match.status === 'AET' ||
    match.status === 'AP'
  ) {
    if (match.result && match.result.includes('-')) {
      [homeScore, awayScore] = match.result.split('-');
    }
  }

  // Detectar ganador para poner en negrita (opcional)
  const homeWin = Number(homeScore) > Number(awayScore);
  const awayWin = Number(awayScore) > Number(homeScore);

  const date = dayjs(match.kickoff).format('dddd DD/MM HH:mm');

  return (
    <Link href={`/event/${match.id}`} className="block w-full">
      <div
        className="
        bg-surface border border-border rounded-lg shadow-sm 
        hover:border-brand hover:shadow-md transition-all 
        overflow-hidden text-xs sm:text-sm group
      "
      >
        {/* Header fecha */}
        <div className="bg-background/50 px-2 py-1 text-[10px] text-center text-muted border-b border-border/50 flex justify-between items-center">
          <span>{date || 'TBD'}</span>
          <span className="font-mono text-brand/80">{match.status}</span>
        </div>

        <div className="p-2 flex flex-col gap-2">
          {/* Local */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 overflow-hidden">
              <Image
                src={match.homeTeam.img as string}
                alt={match.homeTeam.name}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span
                className={`truncate ${homeWin ? 'font-bold text-text' : 'text-text/80'}`}
              >
                {match.homeTeam.name}
              </span>
            </div>
            <span className="font-mono font-medium ml-2">{homeScore}</span>
          </div>

          {/* Visitante */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 overflow-hidden">
              <Image
                src={match.awayTeam.img as string}
                alt={match.awayTeam.name}
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              <span
                className={`truncate ${awayWin ? 'font-bold text-text' : 'text-text/80'}`}
              >
                {match.awayTeam.name}
              </span>
            </div>
            <span className="font-mono font-medium ml-2">{awayScore}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
