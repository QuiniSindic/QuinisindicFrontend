import { EventsPageClient } from '@/components/pages/EventsPageClient';
import { getServerCompetitionsBySport } from '@/services/server/competitions.service';
import { getServerLiveMatches } from '@/services/server/matches.service';
import { getServerSportsOptions } from '@/services/server/sports.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinisindic | Eventos',
};

type Props = {
  searchParams: SearchParams;
};

export default async function EventsPage({ searchParams }: Props) {
  const filters = parseEventFilters(await searchParams, 'events');

  const [initialData, initialCompetitionOptions, initialSportsOptions] = await Promise.all([
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
  ]);

  return (
    <EventsPageClient
      title="Eventos"
      filters={filters}
      initialData={initialData}
      initialCompetitionOptions={initialCompetitionOptions}
      initialSportsOptions={initialSportsOptions}
    />
  );
}
