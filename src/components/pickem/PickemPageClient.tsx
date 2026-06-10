'use client';

import {
  PickemContest,
  PickemEntry,
  PickemLeaderboardEntry,
} from '@/types/domain/pickem';
import { User } from '@/types/auth/auth';
import { Toaster } from 'react-hot-toast';
import { PickemGroups } from './PickemGroups';
import { PickemHero } from './PickemHero';
import { PickemLeaderboard } from './PickemLeaderboard';
import { PickemPicks } from './PickemPicks';
import { PickemProvider } from './PickemProvider';

interface PickemPageClientProps {
  contest: PickemContest;
  initialEntry: PickemEntry | null;
  initialLeaderboard: PickemLeaderboardEntry[];
  isAuthenticated: boolean;
  currentUser: User | null;
}

export function PickemPageClient({
  contest,
  initialEntry,
  initialLeaderboard,
  isAuthenticated,
  currentUser,
}: PickemPageClientProps) {
  return (
    <PickemProvider
      contest={contest}
      initialEntry={initialEntry}
      initialLeaderboard={initialLeaderboard}
      isAuthenticated={isAuthenticated}
      currentUser={currentUser}
    >
      <div className="min-h-screen overflow-hidden bg-background pb-20">
        <Toaster />
        <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_18%_12%,color-mix(in_srgb,var(--brand)_26%,transparent),transparent_32%),radial-gradient(circle_at_80%_0%,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_28%)]" />

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 pt-4 sm:px-6 lg:px-8">
          <PickemHero />
          <PickemGroups />

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <PickemPicks />
            <PickemLeaderboard />
          </section>
        </div>
      </div>
    </PickemProvider>
  );
}
