'use client';

import { useStandingsQueryV2 } from '@/hooks/useStandingLeague';
import { TeamStandingData } from '@/types/standings/standings.types';
import { FOTMOB_IMAGES_URL } from 'core/config';
import Image from 'next/image';

interface StandingsTableProps {
  competition?: string;
}

export default function StandingsTable({ competition }: StandingsTableProps) {
  const {
    data: standing,
    isLoading,
    isError,
    error,
  } = useStandingsQueryV2(competition);

  if (!standing) {
    return (
      <p className="text-center text-muted py-4">
        Clasificación no disponible para esta liga.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="text-center text-muted py-4">
        Cargando clasificación de <strong>{competition}</strong>...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-4">
        Error: {(error as Error).message}
      </p>
    );
  }

  if (!standing || standing.length === 0) {
    return (
      <p className="text-center text-muted py-4">
        Clasificación no disponible para esta liga.
      </p>
    );
  }

  return (
    <table className="w-full text-[13px] sm:text-sm text-left text-text">
      <thead className="text-[11px] sm:text-xs uppercase bg-background text-muted border-b border-border">
        <tr>
          <th className="px-2 py-2 text-center w-8">#</th>
          <th className="px-2 py-2">Equipo</th>
          <th className="px-2 py-2 text-center">PJ</th>
          <th className="px-2 py-2 text-center">G</th>
          <th className="px-2 py-2 text-center">E</th>
          <th className="px-2 py-2 text-center">P</th>
          <th className="px-2 py-2 text-center">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standing.map((team: TeamStandingData) => (
          <tr
            key={team.position}
            className="border-b border-border hover:bg-background transition-colors"
          >
            <td className="px-2 py-1 text-center font-bold">{team.position}</td>

            <td className="px-2 py-1 flex items-center min-w-0">
              <Image
                className="size-6 mr-2 shrink-0"
                src={`${FOTMOB_IMAGES_URL}teamlogo/${team.badge}`}
                alt={team.name}
                width={24}
                height={24}
              />
              <span className="truncate">{team.name}</span>
            </td>

            <td className="px-2 py-1 text-center">{team.played}</td>
            <td className="px-2 py-1 text-center">{team.wins}</td>
            <td className="px-2 py-1 text-center">{team.draws}</td>
            <td className="px-2 py-1 text-center">{team.losses}</td>

            <td className="px-2 py-1 text-center font-semibold">
              {team.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
