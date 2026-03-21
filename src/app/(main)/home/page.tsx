import { HomePageClient } from '@/components/home/HomePageClient';
import { getServerCompetitionsBySport } from '@/services/server/competitions.service';
import { getServerLiveMatches } from '@/services/server/matches.service';
import { getServerSportsOptions } from '@/services/server/sports.service';
import { getServerStandingLeagues } from '@/services/server/standings.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinisindic | Home',
};

type Props = {
  searchParams: SearchParams;
};

export default async function HomePage({ searchParams }: Props) {
  const filters = parseEventFilters(await searchParams, 'events');
  const selectedCompetitionId = filters.competitionId;

  const [initialData, initialCompetitionOptions, initialSportsOptions, initialStandings] =
    await Promise.all([
      getServerLiveMatches(
        filters.sportId ?? undefined,
        filters.competitionId ?? undefined,
        filters.from ?? undefined,
        filters.to ?? undefined,
      ),
      filters.sportId
        ? getServerCompetitionsBySport(filters.sportId)
        : Promise.resolve([]),
      getServerSportsOptions(),
      selectedCompetitionId
        ? getServerStandingLeagues(selectedCompetitionId)
        : Promise.resolve([]),
    ]);

  return (
    <HomePageClient
      filters={filters}
      initialData={initialData}
      initialCompetitionOptions={initialCompetitionOptions}
      initialSportsOptions={initialSportsOptions}
      initialStandings={initialStandings}
    />
  );
}
