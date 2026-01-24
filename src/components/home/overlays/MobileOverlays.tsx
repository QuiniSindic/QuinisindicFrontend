'use client';

import { BottomSheet } from '@/src/components/ui/BottomSheet';
import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import { useEffect, useState } from 'react';
import StandingsTable from '../standings/Standing';
// Si tienes un componente de resultados, impórtalo aquí
// import ResultsList from './ResultsList';

type View = 'standings' | 'results' | null;

export function MobileOverlays() {
  const [view, setView] = useState<View>(null);
  const { selectedLeague } = useSportsFilter();

  useEffect(() => {
    const onStandings = () => setView('standings');
    const onResults = () => setView('results');
    window.addEventListener('open-standings', onStandings as EventListener);
    window.addEventListener('open-results', onResults as EventListener);
    return () => {
      window.removeEventListener(
        'open-standings',
        onStandings as EventListener,
      );
      window.removeEventListener('open-results', onResults as EventListener);
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

      <BottomSheet open={view === 'results'} onClose={close} title="Resultados">
        {/* Reemplaza por tu lista real de resultados */}
        <p className="text-center text-muted py-6">
          Pronto: resultados de la liga.
        </p>
        {/* <ResultsList results={[]} league={selectedLeague} sport={selectedSport} /> pasarle deporte y liga pra pillar results dentro y asi no pillarlos en /home */}
      </BottomSheet>
    </>
  );
}
