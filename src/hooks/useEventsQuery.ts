import { EventFilters } from '@/types/domain/filters';
import { CompetitionData } from '@/types/domain/competitions';
import { useUpcomingMatchesByFilters } from './useMatchesByFilters';

export const useEventsQuery = (
  filters: EventFilters,
  initialData?: CompetitionData[],
) => useUpcomingMatchesByFilters(filters, initialData);
