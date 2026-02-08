// src/components/home/events/EventsSection.tsx
'use client';

import { useSportsFilter } from '@/store/sportsLeagueFilterStore';
import { MatchData } from '@/types/domain/events';
import EventsList from './EventsList';

interface EventsSectionProps {
  title?: string;
  data: MatchData[];
  isLoading: boolean;
  mode: 'events' | 'results';
  full?: boolean;
}

export default function EventsSection({
  title,
  data,
  isLoading,
  mode,
  full = false,
}: EventsSectionProps) {
  const { selectedLeague } = useSportsFilter();

  return (
    <section
      className={`
        flex-1 min-w-0 space-y-4 transition-all duration-300
        ${selectedLeague ? 'lg:flex-2' : 'lg:w-full'}
      `}
    >
      {title && (
        <h2 className="text-xl font-bold px-1 text-foreground">{title}</h2>
      )}

      <EventsList data={data} isLoading={isLoading} mode={mode} full={full} />
    </section>
  );
}
