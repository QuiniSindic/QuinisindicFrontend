'use client';

import EventsSection from '@/components/home/events/EventsSection';
import SportsList from '@/components/home/sportsList/SportsList';
import StandingsContainer from '@/components/home/standings/StandingsContainer';
import { useEventsQuery } from '@/hooks/useEventsQuery';

export default function Home() {
  const { events, isLoading } = useEventsQuery();

  return (
    <div className="mb-4 mx-4 sm:mx-8 md:mx-8 lg:mx-12 xl:mx-12 ">
      <>
        <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 mt-4">
          <SportsList />
          <div className="flex flex-col lg:flex-row lg:gap-4 flex-1">
            <EventsSection data={events} isLoading={isLoading} mode="events" />
            <StandingsContainer />
          </div>
        </div>
      </>
    </div>
  );
}
