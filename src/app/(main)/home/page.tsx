import { HomePageClient } from '@/components/home/HomePageClient';
import { getServerCompetitionsBySport } from '@/services/server/competitions.service';
import { getServerLiveMatches } from '@/services/server/matches.service';
import { getServerStandingLeagues } from '@/services/server/standings.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { getCompetitionIdByLeagueName } from '@/utils/domain/sports';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinisindic | Home',
};

type Props = {
  searchParams: SearchParams;
};

export default async function HomePage({ searchParams }: Props) {
  const filters = parseEventFilters(await searchParams, 'events');
  const selectedCompetitionId =
    filters.competitionId ?? getCompetitionIdByLeagueName(filters.selectedLeague);

  const [initialData, initialCompetitionOptions, initialStandings] =
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
      selectedCompetitionId
        ? getServerStandingLeagues(selectedCompetitionId)
        : Promise.resolve([]),
    ]);

  return (
    <HomePageClient
      filters={filters}
      initialData={initialData}
      initialCompetitionOptions={initialCompetitionOptions}
      initialStandings={initialStandings}
    />
  );
}
