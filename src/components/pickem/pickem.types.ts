import { PickemAwardCandidate } from '@/types/domain/pickem';

export type GroupOrderState = Record<number, number[]>;

export type AwardKey = 'mvp' | 'top_scorer' | 'best_goalkeeper';

export type AwardState = {
  mvp?: number | null;
  top_scorer?: number | null;
  best_goalkeeper?: number | null;
  champion?: number | null;
};

export type AwardCandidatesByKey = Record<AwardKey, PickemAwardCandidate[]>;

export type PickemPendingAction = 'groups' | 'awards' | null;
