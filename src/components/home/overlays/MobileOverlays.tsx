'use client';

import { CompetitionPanel } from '@/components/home/competition/CompetitionPanel';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MobileOverlays() {
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const searchParams = useSearchParams();
  const filters = parseEventFilters(
    Object.fromEntries(searchParams.entries()),
    'events',
  );

  useEffect(() => {
    const onCompetition = () => setIsCompetitionOpen(true);
    window.addEventListener(
      'open-competition-panel',
      onCompetition as EventListener,
    );

    return () => {
      window.removeEventListener(
        'open-competition-panel',
        onCompetition as EventListener,
      );
    };
  }, []);

  return (
    <BottomSheet
      open={isCompetitionOpen}
      onClose={() => setIsCompetitionOpen(false)}
      title={filters.selectedLeague || 'Competicion'}
    >
      {filters.selectedLeague || filters.competitionId ? (
        <CompetitionPanel
          key={filters.competitionId ?? 'competition-panel'}
          competition={filters.selectedLeague || undefined}
          competitionId={filters.competitionId}
        />
      ) : (
        <p className="py-6 text-center text-muted">Selecciona una competicion.</p>
      )}
    </BottomSheet>
  );
}
