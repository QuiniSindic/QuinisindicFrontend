import { LeaderboardPageClient } from '@/components/leaderboard/LeaderboardPageClient';
import {
  getServerLeaderboard,
  getServerLeaderboardFilterOptions,
} from '@/services/server/pageData.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseLeaderboardFilters } from '@/utils/domain/filterParams';
import { Metadata } from 'next';

// TODO: Learn SEO
export const metadata: Metadata = {
  title: 'Quinisindic | Ranking',
};

type Props = {
  searchParams: SearchParams;
};

export default async function LeaderboardPage({ searchParams }: Props) {
  const filters = parseLeaderboardFilters(await searchParams);

  const [{ sports, competitions }, data] = await Promise.all([
    getServerLeaderboardFilterOptions(),
    getServerLeaderboard(filters.scope, filters.filterId),
  ]);

  return (
    <LeaderboardPageClient
      filters={filters}
      data={data}
      sportOptions={sports}
      competitionOptions={competitions}
    />
  );
}
