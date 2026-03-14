'use client';

import { useGetMatchQuery } from '@/hooks/useUpcomingEvents';
import {
  useGetEventPredictions,
  useMyPrediction,
} from '@/hooks/useUserPrediction';
import {
  saveEventPrediction,
  updateEventPrediction,
} from '@/services/browser/predictions.service';

import { useAuth } from '@/hooks/logic/useAuth';
import { User } from '@/types/auth/auth';
import { Prediction } from '@/types/database/table';
import { MatchData } from '@/types/domain/events';
import {
  PredictionPayload,
  PredictionUpdatePayload,
} from '@/types/domain/prediction';
import { Spinner } from '@heroui/react';
import toast, { Toaster } from 'react-hot-toast';
import EventNavigation from './EventNavigation';
import { MatchInfoTabs } from './MatchInfoTabs';
import { NoPredictionWarn } from './NoPredictionWarn';
import PredictionForm from './form/PredictionForm';

interface MatchInfoProps {
  event: MatchData;
  predictions?: Prediction[];
  initialUser?: User | null;
  initialUserPrediction?: Prediction | null;
  returnTo?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export function MatchInfo({
  event,
  predictions: initialPreds,
  initialUser,
  initialUserPrediction,
  returnTo,
}: MatchInfoProps) {
  const { data: user, isLoading: authLoading } = useAuth(initialUser);
  const userId = user?.id ?? '';

  const { data: matchData } = useGetMatchQuery(event.id, event);
  const liveEvent = matchData ?? event;

  const notStarted = liveEvent.status === 'NS';
  const isFinished =
    liveEvent.status === 'FT' ||
    liveEvent.status === 'AET' ||
    liveEvent.status === 'AP';
  const isInProgress =
    liveEvent.status.includes("'") || liveEvent.status === 'HT';

  const {
    data: userPred,
    refetch: refetchUserPred,
    isLoading: isLoadingUserPred,
  } = useMyPrediction(userId, event.id, initialUserPrediction);

  const {
    data: allPredictions,
    refetch: refetchAllPreds,
    isLoading: loadingAllPreds,
  } = useGetEventPredictions(event.id, initialPreds);

  const handleSave = async (values: { home: string; away: string }) => {
    try {
      const payload: PredictionPayload = {
        event_id: event.id,
        competition_id: event.competitionid,
        home_score: parseInt(values.home, 10),
        away_score: parseInt(values.away, 10),
        sport_id: event.sportId,
      };

      await saveEventPrediction(payload);

      toast.success('Prediccion guardada con exito');
      await refetchUserPred();
      await refetchAllPreds();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, 'Error al guardar la prediccion'),
      );
    }
  };

  const handleUpdate = async (values: { home: string; away: string }) => {
    try {
      const payload: PredictionUpdatePayload = {
        home_score: parseInt(values.home, 10),
        away_score: parseInt(values.away, 10),
      };

      await updateEventPrediction(event.id, payload);

      toast.success('Prediccion actualizada con exito');
      await refetchUserPred();
      await refetchAllPreds();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, 'Error al actualizar la prediccion'),
      );
    }
  };

  if (authLoading || isLoadingUserPred) {
    return (
      <div className="flex justify-center text-center items-center min-h-screen">
        <Spinner label="Cargando partido..." variant="wave" />
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <EventNavigation currentId={event.id} returnTo={returnTo} />

      <div className="match-info-container flex flex-col min-h-screen px-4 bg-background text-text pb-32 md:pb-10 max-w-3xl mx-auto">
        <div className="mt-2">
          <NoPredictionWarn status={event.status} prediction={userPred} />
        </div>

        <div className="mt-4">
          <PredictionForm
            key={liveEvent.id}
            event={liveEvent}
            initialPrediction={{
              home: userPred?.home_score ?? '',
              away: userPred?.away_score ?? '',
            }}
            disabled={!(liveEvent.status === 'NS')}
            isLoggedIn={!!user}
            onSubmit={userPred ? handleUpdate : handleSave}
          />
        </div>

        <div className="my-6 h-px w-full bg-border/50" />

        <MatchInfoTabs
          event={liveEvent}
          predictions={allPredictions ?? []}
          isFinished={isFinished}
          isInProgress={isInProgress}
          notStarted={notStarted}
          refetchAllPreds={refetchAllPreds}
          loadingAllPreds={loadingAllPreds}
        />
      </div>
    </>
  );
}

export default MatchInfo;
