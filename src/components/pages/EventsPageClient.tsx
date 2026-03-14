'use client';

import { EventsView } from '@/components/home/events/EventsView';
import { useMatchesByFilters } from '@/hooks/useMatchesByFilters';
import {
  getLiveMatches,
  getPastMatches,
} from '@/services/browser/matches.service';
import { CompetitionData, CompetitionOption } from '@/types/domain/competitions';
import { EventFilters } from '@/types/domain/filters';

interface EventsPageClientProps {
  title: string;
  filters: EventFilters;
  initialData: CompetitionData[];
  initialCompetitionOptions?: CompetitionOption[];
}

export function EventsPageClient({
  title,
  filters,
  initialData,
  initialCompetitionOptions,
}: EventsPageClientProps) {
  const { events, isLoading } = useMatchesByFilters({
    queryKeyBase: filters.mode,
    fetcher: filters.mode === 'results' ? getPastMatches : getLiveMatches,
    filters,
    initialData,
    queryOptions:
      filters.mode === 'results'
        ? {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
          }
        : {
            refetchOnMount: false,
            refetchInterval: 1000 * 60,
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60 * 5,
          },
  });

  return (
    <EventsView
      title={title}
      filters={filters}
      events={events}
      isLoading={isLoading}
      initialCompetitionOptions={initialCompetitionOptions}
    />
  );
}
