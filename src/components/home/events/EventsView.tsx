'use client';

import FilterBar from '@/components/filters/FilterBar';
import { MatchData } from '@/types/domain/events';
import { Suspense } from 'react';
import EventsSection from './EventsSection';

interface EventsPageViewProps {
  title: string;
  mode: 'events' | 'results';
  events: MatchData[];
  isLoading: boolean;
}

export default function EventsView({
  title,
  mode,
  events,
  isLoading,
}: EventsPageViewProps) {
  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">{title}</h1>

          <FilterBar mode={mode} />

          <Suspense fallback={null}>
            <EventsSection
              data={events}
              isLoading={isLoading}
              mode={mode}
              full
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
