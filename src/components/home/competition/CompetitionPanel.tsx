'use client';

import { TournamentBracket } from '@/components/bracket/TournamentBracket';
import { OptionsListButton } from '@/components/ui/buttons/OptionsListButton';
import { useBracketMatches } from '@/hooks/useBracketMatches';
import { useCompetitionPresentation } from '@/hooks/useCompetitionPresentation';
import { useCompetitionStructure } from '@/hooks/useCompetitionStructure';
import { CompetitionStructure } from '@/types/domain/competitions';
import { CompetitionStandingsSnapshot } from '@/types/domain/standings';
import { useMemo, useState } from 'react';
import { StandingsTable } from '../standings/StandingsTable';

interface CompetitionPanelProps {
  competition?: string;
  competitionId?: number | null;
  initialStandings?: CompetitionStandingsSnapshot | null;
  initialStructure?: CompetitionStructure | null;
}

export function CompetitionPanel({
  competition,
  competitionId,
  initialStandings,
  initialStructure,
}: CompetitionPanelProps) {
  const { data: structure, isLoading: isStructureLoading } =
    useCompetitionStructure(competitionId, initialStructure);
  const presentation = useCompetitionPresentation(structure);
  const [selectedView, setSelectedView] = useState<'standings' | 'bracket'>(
    'standings',
  );
  const activeView = useMemo(() => {
    if (!presentation) {
      return 'standings' as const;
    }

    return presentation.availableViews.includes(selectedView)
      ? selectedView
      : presentation.defaultView;
  }, [presentation, selectedView]);
  const {
    data: bracketRounds = [],
    isLoading: isBracketLoading,
  } = useBracketMatches(
    competitionId ?? undefined,
    presentation?.hasBracket ?? false,
  );

  if (!competitionId) {
    return (
      <p className="py-4 text-center text-muted">
        Selecciona una competicion para ver su estructura.
      </p>
    );
  }

  if (!structure && isStructureLoading) {
    return (
      <p className="py-4 text-center text-muted">
        Cargando estructura de <strong>{competition}</strong>...
      </p>
    );
  }

  if (!presentation) {
    return (
      <p className="py-4 text-center text-muted">
        Estructura no disponible para esta competicion.
      </p>
    );
  }

  return (
    <div className="w-full">
      {presentation.availableViews.length > 1 && (
        <div className="mb-3 flex gap-2 overflow-x-auto px-2">
          {presentation.hasStandings && (
            <OptionsListButton
              title={presentation.standingsLabel}
              isSelected={activeView === 'standings'}
              onClick={() => setSelectedView('standings')}
              className="w-[calc(50%-4px)]"
            />
          )}
          {presentation.hasBracket && (
            <OptionsListButton
              title="Cuadro"
              isSelected={activeView === 'bracket'}
              onClick={() => setSelectedView('bracket')}
              className="w-[calc(50%-4px)]"
            />
          )}
        </div>
      )}

      {activeView === 'standings' ? (
        <StandingsTable
          competition={competition}
          competitionId={competitionId}
          initialData={initialStandings}
          structure={structure}
        />
      ) : isBracketLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand" />
        </div>
      ) : bracketRounds.length > 0 ? (
        <div className="h-[60vh] w-full px-2 lg:h-auto">
          <TournamentBracket rounds={bracketRounds} />
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center text-muted">
          <p>No hay cuadro disponible.</p>
        </div>
      )}
    </div>
  );
}
