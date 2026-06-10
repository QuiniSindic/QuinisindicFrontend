'use client';

import { FilterBar } from '@/components/filters/FilterBar';
import { CompetitionOption } from '@/types/domain/competitions';
import { MatchData } from '@/types/domain/events';
import { EventFilters } from '@/types/domain/filters';
import { SportOption } from '@/types/domain/sports';
import { EventsSection } from './EventsSection';

interface EventsPageViewProps {
  title: string;
  filters: EventFilters;
  events: MatchData[];
  isLoading: boolean;
  currentPath?: string;
  initialCompetitionOptions?: CompetitionOption[];
  initialSportsOptions?: SportOption[];
}

export function EventsView({
  title,
  filters,
  events,
  isLoading,
  currentPath,
  initialCompetitionOptions,
  initialSportsOptions,
}: EventsPageViewProps) {
  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">{title}</h1>

          <FilterBar
            filters={filters}
            initialCompetitionOptions={initialCompetitionOptions}
            initialSportsOptions={initialSportsOptions}
          />

          <EventsSection
            data={events}
            filters={filters}
            currentPath={currentPath}
            isLoading={isLoading}
            full
          />
        </div>
      </div>
    </div>
  );
}
