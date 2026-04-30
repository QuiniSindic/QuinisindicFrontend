'use client';

import { useStandingsQuery } from '@/hooks/useStandingLeague';
import { CompetitionStructure } from '@/types/domain/competitions';
import {
  CompetitionStandingsSnapshot,
  TeamStandingData,
} from '@/types/domain/standings';
import { getPositionClass } from '@/utils/domain/sports';
import { FOTMOB_IMAGES_URL } from 'core/config';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface StandingsTableProps {
  competition?: string;
  competitionId?: number | null;
  initialData?: CompetitionStandingsSnapshot | null;
  structure?: CompetitionStructure | null;
}

export function StandingsTable({
  competition,
  competitionId,
  initialData,
  structure,
}: StandingsTableProps) {
  const standingsStages = useMemo(
    () =>
      (structure?.stages ?? []).filter(
        (stage) => stage.stageType === 'league_table' || stage.stageType === 'group',
      ),
    [structure],
  );
  const defaultStageId = standingsStages[0]?.id ?? initialData?.stageId;
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>(
    undefined,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined,
  );
  const activeStageId =
    selectedStageId &&
    standingsStages.some((stage) => stage.id === selectedStageId)
      ? selectedStageId
      : defaultStageId;

  const {
    data: standingsSnapshot,
    isLoading,
    isFetching,
    isError,
    error,
  } = useStandingsQuery(
    competition,
    competitionId,
    activeStageId === defaultStageId ? initialData : null,
    activeStageId,
    undefined,
  );

  const leagueId = competitionId ?? 0;
  const groups = standingsSnapshot?.groups ?? [];
  const activeGroup =
    groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? null;
  const standing = activeGroup?.teams ?? [];

  if (isLoading && !standingsSnapshot) {
    return (
      <p className="py-4 text-center text-muted">
        Cargando clasificacion de <strong>{competition}</strong>...
      </p>
    );
  }

  if (!standingsSnapshot) {
    return (
      <p className="py-4 text-center text-muted">
        Clasificacion no disponible para esta competicion.
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-4 text-center text-red-500">
        Error: {(error as Error).message}
      </p>
    );
  }

  if (standing.length === 0) {
    return (
      <p className="py-4 text-center text-muted">
        Clasificacion no disponible para esta competicion.
      </p>
    );
  }

  return (
    <div className="max-h-150 w-full overflow-x-auto overflow-y-auto scrollbar-hide">
      {isFetching && (
        <div className="mb-3 px-2 text-xs text-muted">Actualizando clasificacion...</div>
      )}

      {standingsStages.length > 1 && (
        <div className="mb-3 overflow-x-auto px-2 scrollbar-hide">
          <div className="inline-flex min-w-full gap-2 rounded-2xl border border-border/70 bg-background/40 p-1">
            {standingsStages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  setSelectedStageId(stage.id);
                  setSelectedGroupId(undefined);
                }}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                  activeStageId === stage.id
                    ? 'border-brand/70 bg-brand text-brand-contrast shadow-sm'
                    : 'border-transparent bg-transparent text-muted hover:border-border/60 hover:bg-background/60 hover:text-text'
                }`}
              >
                {stage.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-3 px-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {standingsSnapshot.stageName}
        </p>
      </div>

      {groups.length > 1 && (
        <div className="mb-3 overflow-x-auto px-2 scrollbar-hide">
          <div className="inline-flex gap-2 pb-1">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={`min-w-20 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                  activeGroup?.id === group.id
                    ? 'border-brand/70 bg-brand/15 text-brand'
                    : 'border-border/70 bg-background/45 text-muted hover:border-border hover:bg-background/70 hover:text-text'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <table className="w-full border-collapse text-left text-[13px] text-text sm:text-sm">
        <thead className="sticky top-0 z-10 border-b border-border bg-surface text-[11px] uppercase text-muted shadow-sm sm:text-xs">
          <tr>
            <th className="w-8 px-2 py-2 text-center">#</th>
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
            const posClass = getPositionClass(leagueId, team.position);
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
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-6 w-6 shrink-0">
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
                    <span className="truncate font-medium text-text transition-colors group-hover:text-brand">
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

                <td className="bg-surface/50 px-2 py-2 text-center font-bold text-text">
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
