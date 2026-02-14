'use client';

import FilterBar from '@/components/filters/FilterBar';
import EventsSection from '@/components/home/events/EventsSection';
import { useResultsQuery } from '@/hooks/useResultsQuery';

export default function ResultsPage() {
  const { events, isLoading } = useResultsQuery();

  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">Resultados</h1>

          <FilterBar mode="results" />

          <EventsSection
            data={events}
            isLoading={isLoading}
            mode="results"
            full
          />
        </div>
      </div>
    </div>
  );
}
