import {
  CompetitionFormatKind,
  CompetitionStage,
} from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';

type KnockoutRoundMeta = {
  id: string;
  name: string;
  order: number;
};

const KNOCKOUT_ROUND_RULES: Array<{
  meta: KnockoutRoundMeta;
  match: (round: string) => boolean;
}> = [
  {
    meta: { id: 'playoff', name: 'Play-offs', order: 10 },
    match: (round) => round === 'playoff' || round.includes('preliminar'),
  },
  {
    meta: { id: 'round_of_16', name: 'Octavos', order: 20 },
    match: (round) =>
      round === '1/8' || round.includes('round of 16') || round.includes('octavos'),
  },
  {
    meta: { id: 'quarterfinals', name: 'Cuartos', order: 30 },
    match: (round) =>
      round === '1/4' || round.includes('quarter') || round.includes('cuartos'),
  },
  {
    meta: { id: 'semifinals', name: 'Semis', order: 40 },
    match: (round) => round === '1/2' || round.includes('semi'),
  },
  {
    meta: { id: 'final', name: 'Final', order: 50 },
    match: (round) =>
      round === 'final' || (round.includes('final') && !round.includes('1/')),
  },
];

const normalizeRoundLabel = (value?: string | null) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

export const getKnockoutRoundMeta = (
  round?: string | null,
): KnockoutRoundMeta | null => {
  const normalizedRound = normalizeRoundLabel(round);
  if (!normalizedRound) return null;

  const matchedRule = KNOCKOUT_ROUND_RULES.find((rule) =>
    rule.match(normalizedRound),
  );

  return matchedRule?.meta ?? null;
};

export const isKnockoutRoundLabel = (round?: string | null): boolean =>
  getKnockoutRoundMeta(round) !== null;

export const buildKnockoutStages = (matches: MatchData[]): CompetitionStage[] => {
  const stageMap = new Map<string, CompetitionStage>();

  matches.forEach((match) => {
    const meta = getKnockoutRoundMeta(match.round);
    if (!meta) return;

    const existingStage = stageMap.get(meta.id);
    if (existingStage) {
      existingStage.matches = [...(existingStage.matches ?? []), match];
      if (match.round && !existingStage.roundLabels?.includes(match.round)) {
        existingStage.roundLabels = [...(existingStage.roundLabels ?? []), match.round];
      }
      return;
    }

    stageMap.set(meta.id, {
      id: meta.id,
      name: meta.name,
      stageType: 'knockout_round',
      order: meta.order,
      roundLabels: match.round ? [match.round] : [],
      matches: [match],
    });
  });

  return Array.from(stageMap.values()).sort((a, b) => a.order - b.order);
};

export const inferCompetitionFormatKind = (
  matches: MatchData[],
): CompetitionFormatKind => {
  if (matches.some((match) => isKnockoutRoundLabel(match.round))) {
    return 'knockout';
  }

  return 'league';
};
