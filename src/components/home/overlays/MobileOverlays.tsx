'use client';

import { TournamentBracket } from '@/components/bracket/TournamentBracket';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useBracketMatches } from '@/hooks/useBracketMatches';
import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { COMPETITIONS_ID_MAP } from '@/utils/domain/sports';
import { useEffect, useState } from 'react';
import StandingsTable from '../standings/Standing';

type View = 'standings' | 'bracket' | null;

export function MobileOverlays() {
  const [view, setView] = useState<View>(null);
  const { selectedLeague } = useSportsFilter();

  const competitionId = selectedLeague
    ? COMPETITIONS_ID_MAP[selectedLeague]
    : undefined;

  const { data: bracketMatches = [], isLoading } =
    useBracketMatches(competitionId);

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
        title={selectedLeague as string}
      >
        {selectedLeague ? (
          <StandingsTable competition={selectedLeague} />
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
