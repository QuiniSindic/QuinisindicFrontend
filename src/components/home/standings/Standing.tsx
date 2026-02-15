'use client';

import { useStandingsQuery } from '@/hooks/useStandingLeague';
import { TeamStandingData } from '@/types/domain/standings';
import {
  getCompetitionIdByLeagueName,
  getPositionClass,
} from '@/utils/domain/sports';
import { FOTMOB_IMAGES_URL } from 'core/config';
import Image from 'next/image';

interface StandingsTableProps {
  competition?: string;
  competitionId?: number | null;
}

export default function StandingsTable({
  competition,
  competitionId,
}: StandingsTableProps) {
  const {
    data: standing,
    isLoading,
    isError,
    error,
  } = useStandingsQuery(competition, competitionId);

  const leagueId = competitionId ?? getCompetitionIdByLeagueName(competition) ?? 0;

  if (!standing) {
    return (
      <p className="text-center text-muted py-4">
        Clasificación no disponible para esta competición.
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
        Clasificación no disponible para esta competición.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto overflow-y-auto max-h-150 scrollbar-hide">
      <table className="w-full text-[13px] sm:text-sm text-left text-text border-collapse">
        <thead className="sticky top-0 z-10 text-[11px] sm:text-xs uppercase bg-surface text-muted border-b border-border shadow-sm">
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
        <tbody className="divide-y divide-border/50">
          {standing.map((team: TeamStandingData, index: number) => {
            // Calculamos el estilo basado en la posición y la liga
            const posClass = getPositionClass(leagueId, team.position);

            // Alternar colores de fondo sutiles
            const rowBg = index % 2 === 0 ? 'bg-transparent' : 'bg-surface/30';

            return (
              <tr
                key={team.id}
                className={`group hover:bg-surface transition-colors ${rowBg}`}
              >
                <td className={`px-2 py-2 text-center text-xs ${posClass}`}>
                  {team.position}
                </td>

                <td className="px-2 py-2">
                  <div className="flex items-center min-w-0 gap-3">
                    <div className="relative w-6 h-6 shrink-0">
                      <Image
                        className="object-contain"
                        src={
                          team.badge.startsWith('http')
                            ? team.badge
                            : `${FOTMOB_IMAGES_URL}teamlogo/${team.badge}`
                        }
                        alt={team.name}
                        fill
                        sizes="24px"
                      />
                    </div>
                    <span className="truncate font-medium text-text group-hover:text-brand transition-colors">
                      {team.name}
                    </span>
                  </div>
                </td>

                <td className="px-1 py-2 text-center text-muted">
                  {team.played}
                </td>
                <td className="px-1 py-2 text-center text-muted">
                  {team.wins}
                </td>
                <td className="px-1 py-2 text-center text-muted">
                  {team.draws}
                </td>
                <td className="px-1 py-2 text-center text-muted">
                  {team.losses}
                </td>

                <td className="px-2 py-2 text-center font-bold text-text bg-surface/50">
                  {team.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
