import { PickemTeam } from '@/types/domain/pickem';

type TeamBadgeProps = {
  team: PickemTeam;
};

export function TeamBadge({ team }: TeamBadgeProps) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-xs font-bold text-brand">
      {team.badge ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={team.badge}
          alt=""
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      ) : (
        team.abbr.slice(0, 3)
      )}
    </span>
  );
}
