'use client';

import EventsContainer from '@/src/components/home/events/EventsContainer';
import SportsList from '@/src/components/home/sportsList/SportsList';
import StandingsContainer from '@/src/components/home/standings/StandingsContainer';
import { useFilteredEvents } from '@/src/hooks/useHomeData';

export default function Home() {
  const { events, isLoading } = useFilteredEvents();

  return (
    <div className="mb-4 mx-4 sm:mx-8 md:mx-8 lg:mx-12 xl:mx-12 ">
      <>
        <div className="flex flex-col lg:flex-row lg:gap-4 mt-4">
          <SportsList />
          <div className="flex flex-col lg:flex-row lg:gap-4 flex-1">
            <EventsContainer events={events} isLoading={isLoading} />
            <StandingsContainer />
          </div>
        </div>
      </>
    </div>
  );
}
