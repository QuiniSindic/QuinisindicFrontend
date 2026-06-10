import { PickemGroup } from '@/types/domain/pickem';
import { TeamBadge } from './TeamBadge';

type GroupPredictionCardProps = {
  group: PickemGroup;
  groupOrder: number[];
  disabled: boolean;
  onPositionChange: (positionIndex: number, participantId: number) => void;
};

export function GroupPredictionCard({
  group,
  groupOrder,
  disabled,
  onPositionChange,
}: GroupPredictionCardProps) {
  const teamsById = new Map(group.teams.map((team) => [team.id, team]));

  return (
    <article className="rounded-lg border border-border bg-background p-3 transition-colors hover:border-brand/60">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Grupo {group.key}
          </p>
          <h3 className="truncate text-lg font-bold text-text">{group.name}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
          {group.teams.length} equipos
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {groupOrder.map((participantId, index) => {
          const selectedTeam = teamsById.get(participantId);

          return (
            <label
              key={`${group.id}-${index}`}
              className="grid grid-cols-[2rem_2.25rem_1fr] items-center gap-2 rounded-lg border border-border bg-surface p-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-sm font-black text-brand">
                {index + 1}
              </span>
              {selectedTeam && <TeamBadge team={selectedTeam} />}
              <select
                value={participantId}
                disabled={disabled}
                onChange={(event) =>
                  onPositionChange(index, Number(event.target.value))
                }
                className="h-10 min-w-0 rounded-lg border border-border bg-background px-3 text-sm font-semibold text-text outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
              >
                {group.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    </article>
  );
}
