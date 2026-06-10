'use client';

import { BracketRoundData, BracketTieData } from '@/types/domain/bracket';
import { formatKickoffBadge } from '@/utils/common/date';
import { getTeamLogoSrc, isFinishedMatchStatus } from '@/utils/domain/events';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BracketMatchCard } from './BracketMatchCard';

interface Props {
  rounds: BracketRoundData[];
  onMatchSelect?: () => void;
}

const getLegScore = (status: string, result: string) => {
  if (!isFinishedMatchStatus(status) || !result.includes('-')) {
    return ['-', '-'];
  }

  return result.split('-', 2);
};

const TieSummary = ({
  tie,
  onMatchSelect,
}: {
  tie: BracketTieData;
  onMatchSelect?: () => void;
}) => (
  <div className="rounded-2xl border border-border/80 bg-surface/90 p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {tie.roundName}
        </p>
        <h3 className="mt-1 text-base font-semibold text-text">
          {tie.homeTeam.name} vs {tie.awayTeam.name}
        </h3>
      </div>
      <div className="rounded-xl bg-background/70 px-3 py-2 text-right">
        <div className="text-[10px] uppercase tracking-wide text-muted">
          {tie.isTwoLegged ? 'Agregado' : 'Resultado'}
        </div>
        <div className="font-mono text-lg font-bold text-text">
          {tie.aggregateHomeScore ?? '-'}-{tie.aggregateAwayScore ?? '-'}
        </div>
      </div>
    </div>

    <div className="mt-4 space-y-3">
      {tie.legs.map((leg) => {
        const [homeScore, awayScore] = getLegScore(leg.status, leg.result);

        return (
          <div
            key={leg.eventId}
            className="rounded-xl border border-border/70 bg-background/35 p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-muted">
              <span>{tie.isTwoLegged ? `Partido ${leg.leg}` : 'Partido'}</span>
              <span>
                {formatKickoffBadge(leg.kickoff, leg.kickoffIso) ?? leg.kickoff}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Image
                    src={getTeamLogoSrc(leg.homeTeam.img)}
                    alt={leg.homeTeam.name}
                    width={20}
                    height={20}
                    sizes="20px"
                    className="h-5 w-5 object-contain"
                  />
                  <span className="truncate font-medium text-text">
                    {leg.homeTeam.name}
                  </span>
                </div>
                <span className="font-mono text-base font-semibold text-text">
                  {homeScore}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Image
                    src={getTeamLogoSrc(leg.awayTeam.img)}
                    alt={leg.awayTeam.name}
                    width={20}
                    height={20}
                    sizes="20px"
                    className="h-5 w-5 object-contain"
                  />
                  <span className="truncate font-medium text-text">
                    {leg.awayTeam.name}
                  </span>
                </div>
                <span className="font-mono text-base font-semibold text-text">
                  {awayScore}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted">{leg.status}</span>
              <Link
                href={`/event/${leg.eventId}`}
                className="text-xs font-semibold text-brand hover:underline"
                onClick={onMatchSelect}
              >
                Ver partido
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const TournamentBracket = ({ rounds, onMatchSelect }: Props) => {
  const activeRounds = rounds.filter((round) => round.ties.length > 0);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [selectedTieId, setSelectedTieId] = useState<string | null>(null);

  const activeTab =
    selectedTab && activeRounds.some((round) => round.id === selectedTab)
      ? selectedTab
      : (activeRounds[0]?.id ?? null);
  const activeRound =
    activeRounds.find((round) => round.id === activeTab) ?? activeRounds[0] ?? null;
  const activeTie =
    activeRound?.ties.find((tie) => tie.id === selectedTieId) ??
    activeRound?.ties[0] ??
    null;

  if (activeRounds.length === 0) {
    return (
      <div className="p-8 text-center text-muted">
        No hay datos de eliminatorias disponibles.
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-4 flex overflow-x-auto border-b border-border scrollbar-hide lg:hidden">
        {activeRounds.map((round) => (
          <button
            key={round.id}
            onClick={() => {
              setSelectedTab(round.id);
              setSelectedTieId(null);
            }}
            className={`flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === round.id
                ? 'border-brand text-brand'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {round.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-1">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <div className="hidden lg:flex lg:items-center lg:gap-4 lg:overflow-x-auto lg:pb-2">
              {activeRounds.map((round) => (
                <button
                  key={round.id}
                  type="button"
                  onClick={() => {
                    setSelectedTab(round.id);
                    setSelectedTieId(null);
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === round.id
                      ? 'border-brand/70 bg-brand/10 text-brand'
                      : 'border-border/70 bg-background/40 text-muted hover:text-text'
                  }`}
                >
                  {round.name}
                </button>
              ))}
            </div>

            {activeRound && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {activeRound.ties.map((tie) => (
                  <BracketMatchCard
                    key={tie.id}
                    tie={tie}
                    isSelected={activeTie?.id === tie.id}
                    onSelect={() => setSelectedTieId(tie.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            {activeTie ? (
              <TieSummary tie={activeTie} onMatchSelect={onMatchSelect} />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-border/80 bg-surface/90 p-6 text-sm text-muted">
                Selecciona una eliminatoria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
