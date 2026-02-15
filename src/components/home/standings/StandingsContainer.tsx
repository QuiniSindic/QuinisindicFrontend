'use client';

import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import StandingsTable from './Standing';

export default function StandingsContainer() {
  const { selectedLeague, selectedCompetitionId } = useSportsFilter();

  if (!selectedLeague && !selectedCompetitionId) return null;

  return (
    <aside className="hidden lg:block lg:w-2/5 bg-surface border border-border rounded-lg h-fit">
      <h1 className="text-2xl font-bold text-center text-text border-b border-border p-2 mb-4">
        Clasificación
      </h1>
      <StandingsTable
        competition={selectedLeague || undefined}
        competitionId={selectedCompetitionId}
      />
    </aside>
  );
}
