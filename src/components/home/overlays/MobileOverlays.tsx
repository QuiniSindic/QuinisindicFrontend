'use client';

import { TournamentBracket } from '@/components/bracket/TournamentBracket';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useBracketMatches } from '@/hooks/useBracketMatches';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StandingsTable } from '../standings/StandingsTable';

type View = 'standings' | 'bracket' | null;

export function MobileOverlays() {
  const [view, setView] = useState<View>(null);
  const searchParams = useSearchParams();
  const filters = parseEventFilters(
    Object.fromEntries(searchParams.entries()),
    'events',
  );

  const { data: bracketMatches = [], isLoading } = useBracketMatches(
    filters.competitionId ?? undefined,
  );

  useEffect(() => {
    const onStandings = () => setView('standings');
    const onBracket = () => setView('bracket');

    window.addEventListener('open-standings', onStandings as EventListener);
    window.addEventListener('open-bracket', onBracket as EventListener);

    return () => {
      window.removeEventListener(
        'open-standings',
        onStandings as EventListener,
      );
      window.removeEventListener('open-bracket', onBracket as EventListener);
    };
  }, []);

  const close = () => setView(null);

  return (
    <>
      <BottomSheet
        open={view === 'standings'}
        onClose={close}
        title={filters.selectedLeague || 'Clasificacion'}
      >
        {filters.selectedLeague || filters.competitionId ? (
          <StandingsTable
            competition={filters.selectedLeague || undefined}
            competitionId={filters.competitionId}
          />
        ) : (
          <p className="text-center text-muted py-6">Selecciona una liga.</p>
        )}
      </BottomSheet>

      <BottomSheet
        open={view === 'bracket'}
        onClose={close}
        title="Eliminatorias"
      >
        <div className="h-[60vh] w-full px-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
            </div>
          ) : bracketMatches.length > 0 ? (
            <TournamentBracket matches={bracketMatches} onMatchSelect={close} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted">
              <p>No hay cuadro disponible.</p>
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
