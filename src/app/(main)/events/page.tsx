'use client';

import EventsView from '@/components/home/events/EventsView';
import { useEventsQuery } from '@/hooks/useEventsQuery';

export default function EventsPage() {
  const { events, isLoading } = useEventsQuery();
  return (
    <EventsView
      title="Eventos"
      mode="events"
      events={events}
      isLoading={isLoading}
    />
  );
}
