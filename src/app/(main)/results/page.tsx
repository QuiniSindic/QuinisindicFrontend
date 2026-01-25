'use client';

import FilterBar from '@/src/components/filters/FilterBar';
import EventsList from '@/src/components/home/events/EventsList';
import { useFilteredEvents } from '@/src/hooks/useHomeData';

export default function ResultsPage() {
  const { events, isLoading } = useFilteredEvents();

  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">Resultados</h1>

          <FilterBar mode="results" />

          <main>
            <EventsList
              data={events}
              isLoading={isLoading}
              full
              mode="results"
            />
          </main>
        </div>
      </div>
    </div>
  );
}
