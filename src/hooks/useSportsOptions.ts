import { getSportsOptions } from '@/services/browser/sports.service';
import { SportOption } from '@/types/domain/sports';
import { useQuery } from '@tanstack/react-query';

export const useSportsOptions = (initialData?: SportOption[]) => {
  return useQuery({
    queryKey: ['sports-options'],
    queryFn: getSportsOptions,
    initialData,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
  });
};
