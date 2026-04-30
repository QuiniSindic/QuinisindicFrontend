import { getCompetitionStandings } from '@/services/browser/standings.service';
import { CompetitionStandingsSnapshot } from '@/types/domain/standings';
import { useQuery } from '@tanstack/react-query';

export const useStandingsQuery = (
  competition?: string,
  competitionIdInput?: number | null,
  initialData?: CompetitionStandingsSnapshot | null,
  stageId?: string,
  groupId?: string,
) => {
  const competitionId = competitionIdInput ?? null;

  return useQuery({
    queryKey: ['standings', competitionId, competition, stageId, groupId],
    queryFn: () => getCompetitionStandings(competitionId!, stageId, groupId),
    enabled: !!competitionId && competitionId > 0,
    initialData,
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
