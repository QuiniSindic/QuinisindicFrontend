import { EventFilters } from '@/types/domain/filters';
import { CompetitionData } from '@/types/domain/competitions';
import { usePastMatchesByFilters } from './useMatchesByFilters';

export const useResultsQuery = (
  filters: EventFilters,
  initialData?: CompetitionData[],
) => usePastMatchesByFilters(filters, initialData);
