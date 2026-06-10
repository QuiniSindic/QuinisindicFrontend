import { CompetitionStage } from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';
import { buildKnockoutStages } from '@/utils/domain/competitionStages';

export interface BracketRound {
  id: string;
  name: string;
  matches: MatchData[];
}

export const organizeBracket = (matches: MatchData[]): BracketRound[] => {
  const stages = buildKnockoutStages(matches);

  return stages.map((stage: CompetitionStage) => ({
    id: stage.id,
    name: stage.name,
    matches: stage.matches ?? [],
  }));
};
