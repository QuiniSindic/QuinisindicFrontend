'use client';

import FilterBar from '@/components/filters/FilterBar';
import EventsSection from '@/components/home/events/EventsSection';
import { useEventsQuery } from '@/hooks/useEventsQuery';

export default function EventsPage() {
  const { events, isLoading } = useEventsQuery();

  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">Eventos</h1>

          <FilterBar mode="events" />

          <EventsSection
            data={events}
            isLoading={isLoading}
            mode="events"
            full
          />
        </div>
      </div>
    </div>
  );
}
