import {
  CompetitionStage,
  CompetitionStructure,
} from '@/types/domain/competitions';
import { useMemo } from 'react';

export type CompetitionPanelView = 'standings' | 'bracket';

export interface CompetitionPresentationModel {
  availableViews: CompetitionPanelView[];
  defaultView: CompetitionPanelView;
  standingsStages: CompetitionStage[];
  bracketStages: CompetitionStage[];
  hasStandings: boolean;
  hasBracket: boolean;
  standingsLabel: string;
}

export const useCompetitionPresentation = (
  structure?: CompetitionStructure | null,
): CompetitionPresentationModel | null =>
  useMemo(() => {
    if (!structure) {
      return null;
    }

    const standingsStages = structure.stages.filter(
      (stage) => stage.stageType === 'league_table' || stage.stageType === 'group',
    );
    const bracketStages = structure.stages.filter(
      (stage) => stage.stageType === 'knockout_round',
    );
    const availableViews: CompetitionPanelView[] = [];

    if (standingsStages.length > 0) {
      availableViews.push('standings');
    }
    if (bracketStages.length > 0) {
      availableViews.push('bracket');
    }
    if (availableViews.length === 0) {
      return null;
    }

    return {
      availableViews,
      defaultView: availableViews[0],
      standingsStages,
      bracketStages,
      hasStandings: standingsStages.length > 0,
      hasBracket: bracketStages.length > 0,
      standingsLabel:
        standingsStages[0]?.stageType === 'group' ? 'Grupos' : 'Clasificacion',
    };
  }, [structure]);
