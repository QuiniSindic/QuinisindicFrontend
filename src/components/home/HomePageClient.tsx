'use client';

import { EventsSection } from '@/components/home/events/EventsSection';
import { SportsList } from '@/components/home/sportsList/SportsList';
import { StandingsContainer } from '@/components/home/standings/StandingsContainer';
import { useEventsQuery } from '@/hooks/useEventsQuery';
import {
  CompetitionData,
  CompetitionOption,
  CompetitionStructure,
} from '@/types/domain/competitions';
import { EventFilters } from '@/types/domain/filters';
import { CompetitionStandingsSnapshot } from '@/types/domain/standings';
import { SportOption } from '@/types/domain/sports';

interface HomePageClientProps {
  filters: EventFilters;
  initialData: CompetitionData[];
  initialCompetitionOptions?: CompetitionOption[];
  initialSportsOptions?: SportOption[];
  initialStandings?: CompetitionStandingsSnapshot | null;
  initialStructure?: CompetitionStructure | null;
}

export function HomePageClient({
  filters,
  initialData,
  initialCompetitionOptions,
  initialSportsOptions,
  initialStandings,
  initialStructure,
}: HomePageClientProps) {
  const { events, isLoading } = useEventsQuery(filters, initialData);

  return (
    <div className="mb-4 mx-4 sm:mx-8 md:mx-8 lg:mx-12 xl:mx-12">
      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 mt-4">
        <SportsList
          filters={filters}
          initialCompetitionOptions={initialCompetitionOptions}
          initialSportsOptions={initialSportsOptions}
        />
        <div className="flex flex-col lg:flex-row lg:gap-4 flex-1">
          <EventsSection
            data={events}
            filters={filters}
            isLoading={isLoading}
          />
          <StandingsContainer
            selectedLeague={filters.selectedLeague}
            selectedCompetitionId={filters.competitionId}
            initialStandings={initialStandings}
            initialStructure={initialStructure}
          />
        </div>
      </div>
    </div>
  );
}
