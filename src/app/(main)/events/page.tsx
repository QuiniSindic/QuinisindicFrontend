import { EventsPageClient } from '@/components/pages/EventsPageClient';
import { getServerLiveMatches } from '@/services/server/pageData.service';
import { SearchParams } from '@/types/domain/search-params';
import { parseEventFilters } from '@/utils/domain/filterParams';
import { Metadata } from 'next';

// TODO: Learn SEO
export const metadata: Metadata = {
  title: 'Quinisindic | Eventos',
};

type Props = {
  searchParams: SearchParams;
};

export default async function EventsPage({ searchParams }: Props) {
  const filters = parseEventFilters(await searchParams, 'events');

  const initialData = await getServerLiveMatches(
    filters.sportId ?? undefined,
    filters.competitionId ?? undefined,
    filters.from ?? undefined,
    filters.to ?? undefined,
  );

  return (
    <EventsPageClient
      title="Eventos"
      filters={filters}
      initialData={initialData}
    />
  );
}
