import {
  PickemAwardPicksPayload,
  PickemEntry,
  PickemGroupOrderPicksPayload,
  PickemLeaderboardEntry,
} from '@/types/domain/pickem';
import { browserApiFetch } from '@/utils/api/browser';

export async function savePickemGroupPicks(
  contestId: number,
  payload: PickemGroupOrderPicksPayload,
) {
  return browserApiFetch<PickemEntry>({
    path: `/api/v2/pickem/contests/${contestId}/groups`,
    method: 'PUT',
    body: payload,
  });
}

export async function savePickemAwardPicks(
  contestId: number,
  payload: PickemAwardPicksPayload,
) {
  return browserApiFetch<PickemEntry>({
    path: `/api/v2/pickem/contests/${contestId}/awards`,
    method: 'PUT',
    body: payload,
  });
}

export async function getPickemLeaderboard(contestId: number) {
  return browserApiFetch<PickemLeaderboardEntry[]>({
    path: `/api/v2/pickem/contests/${contestId}/leaderboard`,
    auth: false,
  });
}
