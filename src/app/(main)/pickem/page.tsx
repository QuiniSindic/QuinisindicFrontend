import { PickemPageClient } from '@/components/pickem/PickemPageClient';
import {
  getServerPickemContest,
  getServerPickemEntry,
  getServerPickemLeaderboard,
} from '@/services/server/pickem.service';
import { getServerCurrentUser } from '@/services/server/auth.service';
import { createClient as createSupabaseClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quinisindic | Pick'em",
};

export const dynamic = 'force-dynamic';

export default async function PickemPage() {
  const supabase = await createSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(session);
  const contest = await getServerPickemContest();

  if (!contest) {
    return (
      <div className="min-h-screen bg-background px-4 pt-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-5">
          <h1 className="text-2xl font-bold text-text">Pick&apos;em</h1>
          <p className="mt-2 text-sm text-muted">
            El pickem del Mundial todavia no esta disponible.
          </p>
        </div>
      </div>
    );
  }

  const [entry, leaderboard, currentUser] = await Promise.all([
    getServerPickemEntry(contest.id),
    getServerPickemLeaderboard(contest.id),
    isAuthenticated ? getServerCurrentUser() : Promise.resolve(null),
  ]);

  return (
    <PickemPageClient
      contest={contest}
      initialEntry={entry}
      initialLeaderboard={leaderboard}
      isAuthenticated={isAuthenticated}
      currentUser={currentUser}
    />
  );
}
