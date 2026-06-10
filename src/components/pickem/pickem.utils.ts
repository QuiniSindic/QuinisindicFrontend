import {
  PickemAwardCandidate,
  PickemContest,
  PickemEntry,
} from '@/types/domain/pickem';
import {
  AwardCandidatesByKey,
  AwardKey,
  AwardState,
  GroupOrderState,
} from './pickem.types';

export const awardLabels: Record<AwardKey, string> = {
  mvp: 'MVP',
  top_scorer: 'Maximo goleador',
  best_goalkeeper: 'Mejor portero',
};

export const positionLabels: Record<string, string> = {
  GK: 'Portero',
  DF: 'Defensa',
  MF: 'Medio',
  FW: 'Delantero',
};

export function buildInitialGroupOrder(
  contest: PickemContest,
  entry: PickemEntry | null,
): GroupOrderState {
  const picksByGroup = new Map<number, number[]>();

  entry?.group_picks.forEach((pick) => {
    const list = picksByGroup.get(pick.group_id) ?? [];
    list[pick.predicted_position - 1] = pick.participant_id;
    picksByGroup.set(pick.group_id, list);
  });

  return Object.fromEntries(
    contest.groups.map((group) => {
      const saved = picksByGroup
        .get(group.id)
        ?.filter((participantId): participantId is number =>
          Boolean(participantId),
        );

      return [
        group.id,
        saved?.length === group.teams.length
          ? saved
          : group.teams.map((team) => team.id),
      ];
    }),
  );
}

export function buildInitialAwardState(entry: PickemEntry | null): AwardState {
  return {
    mvp: entry?.award_picks.find((pick) => pick.award_key === 'mvp')
      ?.candidate_id,
    top_scorer: entry?.award_picks.find(
      (pick) => pick.award_key === 'top_scorer',
    )?.candidate_id,
    best_goalkeeper: entry?.award_picks.find(
      (pick) => pick.award_key === 'best_goalkeeper',
    )?.candidate_id,
    champion: entry?.award_picks.find((pick) => pick.award_key === 'champion')
      ?.participant_id,
  };
}

export function isLocked(deadline: string) {
  return new Date(deadline).getTime() <= Date.now();
}

export function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(deadline));
}

export function formatAwardCandidate(candidate: PickemAwardCandidate) {
  const hasTeamInName =
    candidate.team_name && candidate.display_name.includes(candidate.team_name);
  const teamLabel =
    candidate.team_name && !hasTeamInName ? ` - ${candidate.team_name}` : '';
  const positionLabel = candidate.position_desc
    ? ` - ${candidate.position_desc}`
    : '';

  return `${candidate.display_name}${teamLabel}${positionLabel}`;
}

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function groupAwardCandidates(
  candidates: PickemAwardCandidate[],
): AwardCandidatesByKey {
  return candidates.reduce(
    (acc, candidate) => {
      acc[candidate.award_key].push(candidate);
      return acc;
    },
    {
      mvp: [] as PickemAwardCandidate[],
      top_scorer: [] as PickemAwardCandidate[],
      best_goalkeeper: [] as PickemAwardCandidate[],
    },
  );
}
