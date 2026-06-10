'use client';

import { CompetitionStructure } from '@/types/domain/competitions';
import { CompetitionStandingsSnapshot } from '@/types/domain/standings';
import { CompetitionPanel } from '../competition/CompetitionPanel';

interface StandingsContainerProps {
  selectedLeague: string | null;
  selectedCompetitionId: number | null;
  initialStandings?: CompetitionStandingsSnapshot | null;
  initialStructure?: CompetitionStructure | null;
}

export function StandingsContainer({
  selectedLeague,
  selectedCompetitionId,
  initialStandings,
  initialStructure,
}: StandingsContainerProps) {
  if (!selectedLeague && !selectedCompetitionId) return null;

  return (
    <aside className="hidden lg:block lg:w-2/5 bg-surface border border-border rounded-lg h-fit">
      <h1 className="text-2xl font-bold text-center text-text border-b border-border p-2 mb-4">
        {selectedLeague || 'Competición'}
      </h1>
      <CompetitionPanel
        key={selectedCompetitionId ?? 'competition-panel'}
        competition={selectedLeague || undefined}
        competitionId={selectedCompetitionId}
        initialStandings={initialStandings}
        initialStructure={initialStructure}
      />
    </aside>
  );
}
