'use client';

import { PickemContest } from '@/types/domain/pickem';
import { LoaderCircle, Trophy } from 'lucide-react';
import { AwardCandidatePicker } from './AwardCandidatePicker';
import { usePickem } from './PickemProvider';
import { SectionHeader } from './SectionHeader';
import {
  AwardCandidatesByKey,
  AwardKey,
  AwardState,
} from './pickem.types';
import { awardLabels } from './pickem.utils';

type PickemPicksViewProps = {
  contest: PickemContest;
  awardState: AwardState;
  awardCandidates: AwardCandidatesByKey;
  awardsLocked: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
  isSavingAwards: boolean;
  hasSavedAwardPicks: boolean;
  hasRequiredAwardCandidates: boolean;
  missingAwardLabels: string[];
  onSave: () => void;
  onAwardChange: (awardKey: AwardKey, candidateId: number) => void;
  onChampionChange: (participantId: number) => void;
};

function PickemPicksView({
  contest,
  awardState,
  awardCandidates,
  awardsLocked,
  isAuthenticated,
  isPending,
  isSavingAwards,
  hasSavedAwardPicks,
  hasRequiredAwardCandidates,
  missingAwardLabels,
  onSave,
  onAwardChange,
  onChampionChange,
}: PickemPicksViewProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-5">
      <SectionHeader
        eyebrow="Premios individuales"
        title="Premios y campeon"
        description="Completa los pronosticos de largo recorrido. Estos picks pesan cuando el torneo ya esta decidido."
        deadline={contest.awards_deadline}
        locked={awardsLocked}
        action={
          <button
            type="button"
            onClick={onSave}
            disabled={
              !isAuthenticated ||
              awardsLocked ||
              !hasRequiredAwardCandidates ||
              isPending
            }
            aria-busy={isSavingAwards}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold text-brand-contrast shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
          >
            {isSavingAwards ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Trophy className="h-4 w-4" aria-hidden />
            )}
            {isSavingAwards
              ? 'Guardando...'
              : hasSavedAwardPicks
                ? 'Editar premios'
                : 'Guardar premios'}
          </button>
        }
      />

      {isSavingAwards && (
        <p
          role="status"
          className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted"
        >
          Guardando tus premios. Espera la confirmacion antes de salir o
          cambiar de pagina.
        </p>
      )}

      {!hasRequiredAwardCandidates && (
        <p className="mt-3 rounded-lg border border-border bg-background p-3 text-sm text-muted">
          Faltan candidatos para: {missingAwardLabels.join(', ')}.
        </p>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(['mvp', 'top_scorer', 'best_goalkeeper'] as const).map((awardKey) => (
          <div
            key={awardKey}
            className="rounded-lg border border-border bg-background p-3"
          >
            <AwardCandidatePicker
              label={awardLabels[awardKey]}
              candidates={awardCandidates[awardKey]}
              selectedId={awardState[awardKey]}
              disabled={awardCandidates[awardKey].length === 0 || awardsLocked}
              onChange={(candidateId) => onAwardChange(awardKey, candidateId)}
            />
          </div>
        ))}

        <label className="flex flex-col gap-1 rounded-lg border border-border bg-background p-3">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            Campeon
          </span>
          <select
            value={awardState.champion ?? ''}
            disabled={awardsLocked}
            onChange={(event) => onChampionChange(Number(event.target.value))}
            className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-text outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
          >
            <option value="">Seleccionar</option>
            {contest.champion_candidates.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export function PickemPicks() {
  const {
    state: { contest, awardState },
    actions: { saveAwards, updateAward, updateChampion },
    meta: {
      awardCandidates,
      awardsLocked,
      hasRequiredAwardCandidates,
      isAuthenticated,
      isPending,
      pendingAction,
      hasSavedAwardPicks,
      missingAwardLabels,
    },
  } = usePickem();

  return (
    <PickemPicksView
      contest={contest}
      awardState={awardState}
      awardCandidates={awardCandidates}
      awardsLocked={awardsLocked}
      isAuthenticated={isAuthenticated}
      isPending={isPending}
      isSavingAwards={pendingAction === 'awards'}
      hasSavedAwardPicks={hasSavedAwardPicks}
      hasRequiredAwardCandidates={hasRequiredAwardCandidates}
      missingAwardLabels={missingAwardLabels}
      onSave={saveAwards}
      onAwardChange={updateAward}
      onChampionChange={updateChampion}
    />
  );
}
