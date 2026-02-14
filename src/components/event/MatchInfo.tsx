'use client';

import { useGetMatchQuery } from '@/hooks/useUpcomingEvents';
import {
  useGetEventPredictions,
  useMyPrediction,
} from '@/hooks/useUserPrediction';
import {
  saveEventPredictionV2,
  updateEventPredictionV2,
} from '@/services/predictions.service';

import { useAuth } from '@/hooks/logic/useAuth';
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
  returnTo?: string;
}

const MatchInfo: React.FC<MatchInfoProps> = ({
  event,
  predictions: initialPreds,
  returnTo,
}) => {
  const { data: user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? '';

  const { data: matchData } = useGetMatchQuery(event.id);
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
  } = useMyPrediction(userId, event.id);

  console.log({ userPred });

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

      await saveEventPredictionV2(payload);

      toast.success('¡Predicción guardada con éxito!');
      await refetchUserPred();
      await refetchAllPreds();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar la predicción');
    }
  };

  const handleUpdate = async (values: { home: string; away: string }) => {
    try {
      const payload: PredictionUpdatePayload = {
        home_score: parseInt(values.home, 10),
        away_score: parseInt(values.away, 10),
      };

      await updateEventPredictionV2(event.id, payload);

      toast.success('¡Predicción actualizada con éxito!');
      await refetchUserPred();
      await refetchAllPreds();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la predicción');
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
        {/* Aviso de estado (Login / No empezado) */}
        <div className="mt-2">
          <NoPredictionWarn status={event.status} prediction={userPred} />
        </div>

        {/* Formulario Principal (Tarjeta de Marcador) */}
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

        {/* Separador sutil */}
        <div className="my-6 h-px w-full bg-border/50" />

        {/* Pestañas de Información */}
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
};

export default MatchInfo;
