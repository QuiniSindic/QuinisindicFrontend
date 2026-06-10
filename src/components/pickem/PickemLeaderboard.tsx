'use client';

import { PickemLeaderboardEntry } from '@/types/domain/pickem';
import { Crown, Medal, ShieldCheck } from 'lucide-react';
import { usePickem } from './PickemProvider';

type PickemLeaderboardProps = {
  leaderboard: PickemLeaderboardEntry[];
};

function PickemLeaderboardView({ leaderboard }: PickemLeaderboardProps) {
  return (
    <aside className="rounded-lg border border-border bg-surface p-4 shadow-sm lg:sticky lg:top-4 lg:self-start">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Liga
          </p>
          <h2 className="text-2xl font-bold text-text">Ranking</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-brand">
          <Medal className="h-5 w-5" aria-hidden />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {leaderboard.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-5 text-center">
            <ShieldCheck className="mx-auto h-6 w-6 text-brand" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-text">
              Aún no hay ranking
            </p>
            <p className="mt-1 text-xs text-muted">
              Cuando se guarden picks, apareceran aquií
            </p>
          </div>
        ) : (
          leaderboard.slice(0, 8).map((row, index) => (
            <div
              key={row.user_id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-sm font-black text-brand">
                  {index === 0 ? (
                    <Crown className="h-4 w-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text">
                    {row.username}
                  </p>
                  <p className="text-xs text-muted">
                    {row.group_points} grupos - {row.award_points} premios
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-brand px-2.5 py-1 text-sm font-black text-brand-contrast">
                {row.total_points}
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export function PickemLeaderboard() {
  const {
    state: { leaderboard },
  } = usePickem();

  return <PickemLeaderboardView leaderboard={leaderboard} />;
}
