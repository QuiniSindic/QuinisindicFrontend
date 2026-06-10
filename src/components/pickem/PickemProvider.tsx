'use client';

import {
  savePickemAwardPicks,
  savePickemGroupPicks,
} from '@/services/browser/pickem.service';
import {
  PickemContest,
  PickemEntry,
  PickemGroup,
  PickemLeaderboardEntry,
} from '@/types/domain/pickem';
import { User } from '@/types/auth/auth';
import { ApiError } from '@/utils/api/shared';
import {
  createContext,
  use,
  useMemo,
  useState,
  useTransition,
} from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import {
  AwardKey,
  AwardState,
  GroupOrderState,
  PickemPendingAction,
} from './pickem.types';
import {
  awardLabels,
  buildInitialAwardState,
  buildInitialGroupOrder,
  groupAwardCandidates,
  isLocked,
} from './pickem.utils';

type PickemState = {
  contest: PickemContest;
  entry: PickemEntry | null;
  currentUser: User | null;
  groupOrder: GroupOrderState;
  awardState: AwardState;
  leaderboard: PickemLeaderboardEntry[];
};

type PickemActions = {
  updateGroupPosition: (
    group: PickemGroup,
    positionIndex: number,
    participantId: number,
  ) => void;
  updateAward: (awardKey: AwardKey, candidateId: number) => void;
  updateChampion: (participantId: number) => void;
  saveGroups: () => void;
  saveAwards: () => void;
};

type PickemMeta = {
  isAuthenticated: boolean;
  isPending: boolean;
  pendingAction: PickemPendingAction;
  groupsLocked: boolean;
  awardsLocked: boolean;
  totalGroups: number;
  totalTeams: number;
  savedGroupPicks: number;
  savedAwardPicks: number;
  hasSavedGroupPicks: boolean;
  hasSavedAwardPicks: boolean;
  awardCandidates: ReturnType<typeof groupAwardCandidates>;
  hasRequiredAwardCandidates: boolean;
  missingAwardLabels: string[];
};

type PickemContextValue = {
  state: PickemState;
  actions: PickemActions;
  meta: PickemMeta;
};

type PickemProviderProps = {
  contest: PickemContest;
  initialEntry: PickemEntry | null;
  initialLeaderboard: PickemLeaderboardEntry[];
  isAuthenticated: boolean;
  currentUser: User | null;
  children: ReactNode;
};

const PickemContext = createContext<PickemContextValue | null>(null);

function applySavedEntry(
  contest: PickemContest,
  savedEntry: PickemEntry,
  setEntry: (entry: PickemEntry) => void,
  setGroupOrder: (state: GroupOrderState) => void,
  setAwardState: (state: AwardState) => void,
) {
  setEntry(savedEntry);
  setGroupOrder(buildInitialGroupOrder(contest, savedEntry));
  setAwardState(buildInitialAwardState(savedEntry));
}

export function PickemProvider({
  contest,
  initialEntry,
  initialLeaderboard,
  isAuthenticated,
  currentUser,
  children,
}: PickemProviderProps) {
  const [entry, setEntry] = useState(initialEntry);
  const [groupOrder, setGroupOrder] = useState(() =>
    buildInitialGroupOrder(contest, initialEntry),
  );
  const [awardState, setAwardState] = useState(() =>
    buildInitialAwardState(initialEntry),
  );
  const [pendingAction, setPendingAction] =
    useState<PickemPendingAction>(null);
  const [isPending, startTransition] = useTransition();

  const groupsLocked = isLocked(contest.group_deadline);
  const awardsLocked = isLocked(contest.awards_deadline);
  const totalGroups = contest.groups.length;
  const totalTeams = contest.groups.reduce(
    (total, group) => total + group.teams.length,
    0,
  );
  const savedGroupPicks = entry?.group_picks.length ?? 0;
  const savedAwardPicks = entry?.award_picks.length ?? 0;
  const hasSavedGroupPicks = savedGroupPicks > 0;
  const hasSavedAwardPicks = savedAwardPicks > 0;
  const awardCandidates = useMemo(
    () => groupAwardCandidates(contest.award_candidates),
    [contest.award_candidates],
  );
  const hasRequiredAwardCandidates =
    awardCandidates.mvp.length > 0 &&
    awardCandidates.top_scorer.length > 0 &&
    awardCandidates.best_goalkeeper.length > 0;
  const missingAwardLabels = (['mvp', 'top_scorer', 'best_goalkeeper'] as const)
    .filter((awardKey) => awardCandidates[awardKey].length === 0)
    .map((awardKey) => awardLabels[awardKey]);

  const updateGroupPosition = (
    group: PickemGroup,
    positionIndex: number,
    nextParticipantId: number,
  ) => {
    setGroupOrder((current) => {
      const nextOrder = [...(current[group.id] ?? [])];
      const previousParticipantId = nextOrder[positionIndex];
      const duplicateIndex = nextOrder.findIndex(
        (participantId) => participantId === nextParticipantId,
      );

      nextOrder[positionIndex] = nextParticipantId;
      if (duplicateIndex >= 0 && duplicateIndex !== positionIndex) {
        nextOrder[duplicateIndex] = previousParticipantId;
      }

      return { ...current, [group.id]: nextOrder };
    });
  };

  const updateAward = (awardKey: AwardKey, candidateId: number) => {
    setAwardState((current) => ({
      ...current,
      [awardKey]: candidateId,
    }));
  };

  const updateChampion = (participantId: number) => {
    setAwardState((current) => ({
      ...current,
      champion: participantId,
    }));
  };

  const saveGroups = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesion para guardar tus picks');
      return;
    }

    startTransition(async () => {
      setPendingAction('groups');
      const toastId = toast.loading('Guardando grupos...');
      try {
        const savedEntry = await savePickemGroupPicks(contest.id, {
          groups: contest.groups.map((group) => ({
            group_id: group.id,
            participant_ids: groupOrder[group.id],
          })),
        });
        applySavedEntry(
          contest,
          savedEntry,
          setEntry,
          setGroupOrder,
          setAwardState,
        );
        toast.success('Grupos guardados. Ya puedes salir de la pagina.', {
          id: toastId,
        });
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'No se pudieron guardar los grupos';
        toast.error(message, { id: toastId });
      } finally {
        setPendingAction(null);
      }
    });
  };

  const saveAwards = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesion para guardar tus picks');
      return;
    }

    const {
      mvp,
      top_scorer: topScorer,
      best_goalkeeper: bestGoalkeeper,
      champion,
    } = awardState;

    if (!mvp || !topScorer || !bestGoalkeeper || !champion) {
      toast.error('Completa todos los picks iniciales');
      return;
    }

    startTransition(async () => {
      setPendingAction('awards');
      const toastId = toast.loading('Guardando premios...');
      try {
        const savedEntry = await savePickemAwardPicks(contest.id, {
          mvp_candidate_id: mvp,
          top_scorer_candidate_id: topScorer,
          best_goalkeeper_candidate_id: bestGoalkeeper,
          champion_participant_id: champion,
        });
        applySavedEntry(
          contest,
          savedEntry,
          setEntry,
          setGroupOrder,
          setAwardState,
        );
        toast.success('Premios guardados. Ya puedes salir de la pagina.', {
          id: toastId,
        });
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'No se pudieron guardar los picks';
        toast.error(message, { id: toastId });
      } finally {
        setPendingAction(null);
      }
    });
  };

  const value: PickemContextValue = {
    state: {
      contest,
      entry,
      currentUser,
      groupOrder,
      awardState,
      leaderboard: initialLeaderboard,
    },
    actions: {
      updateGroupPosition,
      updateAward,
      updateChampion,
      saveGroups,
      saveAwards,
    },
    meta: {
      isAuthenticated,
      isPending,
      pendingAction,
      groupsLocked,
      awardsLocked,
      totalGroups,
      totalTeams,
      savedGroupPicks,
      savedAwardPicks,
      hasSavedGroupPicks,
      hasSavedAwardPicks,
      awardCandidates,
      hasRequiredAwardCandidates,
      missingAwardLabels,
    },
  };

  return <PickemContext value={value}>{children}</PickemContext>;
}

export function usePickem() {
  const value = use(PickemContext);

  if (!value) {
    throw new Error('usePickem must be used within PickemProvider');
  }

  return value;
}
