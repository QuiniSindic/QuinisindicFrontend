'use client';

import EventsView from '@/components/home/events/EventsView';
import { useResultsQuery } from '@/hooks/useResultsQuery';

export default function ResultsPage() {
  const { events, isLoading } = useResultsQuery();
  return (
    <EventsView
      title="Resultados"
      mode="results"
      events={events}
      isLoading={isLoading}
    />
  );
}
