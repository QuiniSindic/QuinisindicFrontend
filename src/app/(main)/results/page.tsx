import { EventsPageClient } from '@/components/pages/EventsPageClient';
import { getServerCompetitionsBySport } from '@/services/server/competitions.service';
import { getServerPastMatches } from '@/services/server/matches.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quinisindic | Resultados',
};

type Props = {
  searchParams: SearchParams;
};

export default async function ResultsPage({ searchParams }: Props) {
  const filters = parseEventFilters(await searchParams, 'results');

  const [initialData, initialCompetitionOptions] = await Promise.all([
    getServerPastMatches(
      filters.sportId ?? undefined,
      filters.competitionId ?? undefined,
      filters.from ?? undefined,
      filters.to ?? undefined,
    ),
    filters.sportId
      ? getServerCompetitionsBySport(filters.sportId)
      : Promise.resolve([]),
  ]);

  return (
    <EventsPageClient
      title="Resultados"
      filters={filters}
      initialData={initialData}
      initialCompetitionOptions={initialCompetitionOptions}
    />
  );
}
