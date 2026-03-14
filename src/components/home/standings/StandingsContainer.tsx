'use client';

import { TeamStandingData } from '@/types/domain/standings';
import { StandingsTable } from './StandingsTable';

interface StandingsContainerProps {
  selectedLeague: string | null;
  selectedCompetitionId: number | null;
  initialStandings?: TeamStandingData[];
}

export function StandingsContainer({
  selectedLeague,
  selectedCompetitionId,
  initialStandings,
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
        initialData={initialStandings}
      />
    </aside>
  );
}
