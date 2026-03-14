'use client';

import { StandingsTable } from './StandingsTable';

interface StandingsContainerProps {
  selectedLeague: string | null;
  selectedCompetitionId: number | null;
}

export function StandingsContainer({
  selectedLeague,
  selectedCompetitionId,
}: StandingsContainerProps) {
  if (!selectedLeague && !selectedCompetitionId) return null;

  return (
    <aside className="hidden lg:block lg:w-2/5 bg-surface border border-border rounded-lg h-fit">
      <h1 className="text-2xl font-bold text-center text-text border-b border-border p-2 mb-4">
        Clasificacion
      </h1>
      <StandingsTable
        competition={selectedLeague || undefined}
        competitionId={selectedCompetitionId}
      />
    </aside>
  );
}
