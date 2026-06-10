'use client';

import { BracketTieData } from '@/types/domain/bracket';
import { formatKickoffBadge } from '@/utils/common/date';
import { getTeamLogoSrc } from '@/utils/domain/events';
import Image from 'next/image';

interface Props {
  tie: BracketTieData;
  isSelected?: boolean;
  onSelect: () => void;
}

export const BracketMatchCard = ({
  tie,
  isSelected = false,
  onSelect,
}: Props) => {
  const aggregateLabel =
    tie.aggregateHomeScore !== null &&
    tie.aggregateHomeScore !== undefined &&
    tie.aggregateAwayScore !== null &&
    tie.aggregateAwayScore !== undefined
      ? `${tie.aggregateHomeScore}-${tie.aggregateAwayScore}`
      : 'vs';
  const primaryLeg = tie.legs[0];
  const kickoffLabel = primaryLeg
    ? formatKickoffBadge(primaryLeg.kickoff, primaryLeg.kickoffIso) ??
      primaryLeg.kickoff
    : 'TBD';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full overflow-hidden rounded-2xl border text-left text-xs transition-all ${
        isSelected
          ? 'border-brand/70 bg-surface shadow-[0_0_0_1px_rgba(168,85,247,0.25)]'
          : 'border-border/80 bg-surface/85 hover:border-border hover:bg-surface'
      }`}
    >
      <div className="space-y-3 px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
            {tie.isTwoLegged ? 'Ida y vuelta' : tie.roundName}
          </span>
          <span className="font-mono text-sm font-bold text-text">
            {aggregateLabel}
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Image
              src={getTeamLogoSrc(tie.homeTeam.img)}
              alt={tie.homeTeam.name}
              width={20}
              height={20}
              sizes="20px"
              className="h-5 w-5 object-contain"
            />
            <span className="truncate font-semibold text-text">
              {tie.homeTeam.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={getTeamLogoSrc(tie.awayTeam.img)}
              alt={tie.awayTeam.name}
              width={20}
              height={20}
              sizes="20px"
              className="h-5 w-5 object-contain"
            />
            <span className="truncate font-semibold text-text">
              {tie.awayTeam.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-[11px] text-muted">
          <span>{kickoffLabel}</span>
          <span>
            {tie.isTwoLegged
              ? `${tie.legs.length} partidos`
              : primaryLeg?.status ?? 'NS'}
          </span>
        </div>
      </div>
    </button>
  );
};
