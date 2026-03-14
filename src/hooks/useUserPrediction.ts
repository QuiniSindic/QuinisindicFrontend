import {
  getEventPredictions,
  getUserMatchPrediction,
} from '@/services/browser/predictions.service';
import { Prediction } from '@/types/database/table';
import { useQuery } from '@tanstack/react-query';

export const useMyPrediction = (
  userId: string,
  eventId: number,
  initialData?: Prediction | null,
) => {
  return useQuery({
    queryKey: ['userPrediction', userId, eventId],
    queryFn: () => getUserMatchPrediction(eventId),
    initialData,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
};

export const useGetEventPredictions = (
  eventId: number,
  initial?: Prediction[],
) => {
  return useQuery({
    queryKey: ['eventPredictions', eventId],
    queryFn: () => getEventPredictions(eventId),
    initialData: initial,
    refetchOnWindowFocus: false,
  });
};
