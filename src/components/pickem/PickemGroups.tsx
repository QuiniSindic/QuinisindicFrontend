'use client';

import { PickemContest, PickemGroup } from '@/types/domain/pickem';
import { LoaderCircle, Save } from 'lucide-react';
import { useState } from 'react';
import { GroupPredictionCard } from './GroupPredictionCard';
import { usePickem } from './PickemProvider';
import { SectionHeader } from './SectionHeader';
import { GroupOrderState } from './pickem.types';

type PickemGroupsViewProps = {
  contest: PickemContest;
  groupOrder: GroupOrderState;
  groupsLocked: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
  isSavingGroups: boolean;
  hasSavedGroupPicks: boolean;
  totalGroups: number;
  totalTeams: number;
  onSave: () => void;
  onPositionChange: (
    group: PickemGroup,
    positionIndex: number,
    participantId: number,
  ) => void;
};

function PickemGroupsView({
  contest,
  groupOrder,
  groupsLocked,
  isAuthenticated,
  isPending,
  isSavingGroups,
  hasSavedGroupPicks,
  totalGroups,
  totalTeams,
  onSave,
  onPositionChange,
}: PickemGroupsViewProps) {
  const [activeGroupId, setActiveGroupId] = useState(
    () => contest.groups[0]?.id,
  );
  const activeGroup =
    contest.groups.find((group) => group.id === activeGroupId) ??
    contest.groups[0];

  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-5">
      <SectionHeader
        eyebrow={`${totalGroups} grupos - ${totalTeams} equipos`}
        title="Fase de grupos"
        description="Elige el orden final de cada grupo. Si repites un equipo en otra posicion, lo intercambiamos automaticamente."
        deadline={contest.group_deadline}
        locked={groupsLocked}
        action={
          <button
            type="button"
            onClick={onSave}
            disabled={!isAuthenticated || groupsLocked || isPending}
            aria-busy={isSavingGroups}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-bold text-brand-contrast shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
          >
            {isSavingGroups ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            {isSavingGroups
              ? 'Guardando...'
              : hasSavedGroupPicks
                ? 'Editar grupos'
                : 'Guardar grupos'}
          </button>
        }
      />

      {isSavingGroups && (
        <p
          role="status"
          className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-muted"
        >
          Guardando tus grupos. Espera la confirmacion antes de salir o cambiar
          de pagina.
        </p>
      )}

      <div className="mt-5 lg:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {contest.groups.map((group) => {
            const isActive = group.id === activeGroup.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroupId(group.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? 'border-brand bg-brand text-brand-contrast'
                    : 'border-border bg-background text-muted'
                }`}
                aria-pressed={isActive}
              >
                {group.name}
              </button>
            );
          })}
        </div>

        {activeGroup && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted">
              Grupo{' '}
              {contest.groups.findIndex(
                (group) => group.id === activeGroup.id,
              ) + 1}{' '}
              de {totalGroups}
            </p>
            <GroupPredictionCard
              group={activeGroup}
              groupOrder={groupOrder[activeGroup.id] ?? []}
              disabled={groupsLocked}
              onPositionChange={(positionIndex, participantId) =>
                onPositionChange(activeGroup, positionIndex, participantId)
              }
            />
          </div>
        )}
      </div>

      <div className="mt-5 hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-2">
        {contest.groups.map((group) => (
          <GroupPredictionCard
            key={group.id}
            group={group}
            groupOrder={groupOrder[group.id] ?? []}
            disabled={groupsLocked}
            onPositionChange={(positionIndex, participantId) =>
              onPositionChange(group, positionIndex, participantId)
            }
          />
        ))}
      </div>
    </section>
  );
}

export function PickemGroups() {
  const {
    state: { contest, groupOrder },
    actions: { saveGroups, updateGroupPosition },
    meta: {
      groupsLocked,
      isAuthenticated,
      isPending,
      pendingAction,
      hasSavedGroupPicks,
      totalGroups,
      totalTeams,
    },
  } = usePickem();

  return (
    <PickemGroupsView
      contest={contest}
      groupOrder={groupOrder}
      groupsLocked={groupsLocked}
      isAuthenticated={isAuthenticated}
      isPending={isPending}
      isSavingGroups={pendingAction === 'groups'}
      hasSavedGroupPicks={hasSavedGroupPicks}
      totalGroups={totalGroups}
      totalTeams={totalTeams}
      onSave={saveGroups}
      onPositionChange={updateGroupPosition}
    />
  );
}
