import { EventsPageClient } from '@/components/pages/EventsPageClient';
import { getServerPastMatches } from '@/services/server/pageData.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { Metadata } from 'next';

// TODO: Learn SEO
export const metadata: Metadata = {
  title: 'Quinisindic | Resultados',
};

type Props = {
  searchParams: SearchParams;
};

export default async function ResultsPage({ searchParams }: Props) {
  const filters = parseEventFilters(await searchParams, 'results');

  const initialData = await getServerPastMatches(
    filters.sportId ?? undefined,
    filters.competitionId ?? undefined,
    filters.from ?? undefined,
    filters.to ?? undefined,
  );

  return (
    <EventsPageClient
      title="Resultados"
      filters={filters}
      initialData={initialData}
    />
  );
}
