'use client';

import { MatchData } from '@/types/domain/events';
import { EventFilters } from '@/types/domain/filters';
import { EventsList } from './EventsList';

interface EventsSectionProps {
  title?: string;
  data: MatchData[];
  filters: EventFilters;
  currentPath?: string;
  isLoading: boolean;
  full?: boolean;
}

export function EventsSection({
  title,
  data,
  filters,
  currentPath,
  isLoading,
  full = false,
}: EventsSectionProps) {
  return (
    <section
      className={`
        flex-1 min-w-0 space-y-4 transition-all duration-300
        ${filters.selectedLeague || filters.competitionId ? 'lg:flex-2' : 'lg:w-full'}
      `}
    >
      {title && (
        <h2 className="text-xl font-bold px-1 text-foreground">{title}</h2>
      )}

      <EventsList
        data={data}
        filters={filters}
        currentPath={currentPath}
        isLoading={isLoading}
        full={full}
      />
    </section>
  );
}
