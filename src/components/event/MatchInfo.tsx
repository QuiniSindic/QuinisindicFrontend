'use client';

import { useGetMatchQueryV2 } from '@/hooks/useUpcomingEvents';
import {
  useGetEventPredictionsV2,
  useMyPrediction,
} from '@/hooks/useUserPrediction';
import {
  saveEventPrediction,
  updateEventPrediction,
} from '@/services/predictions.service';

import { useAuth } from '@/hooks/useAuth';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import { Prediction } from '@/types/database/table.types';
import { MatchData } from '@/types/events/events.types';
import {
  PredictionPayload,
  PredictionUpdatePayload,
} from '@/types/prediction.types';
import { Spinner } from '@heroui/react';
import toast, { Toaster } from 'react-hot-toast';
import EventNavigation from './EventNavigation';
import { MatchInfoTabs } from './MatchInfoTabs';
import { NoPredictionWarn } from './NoPredictionWarn';
import PredictionForm from './form/PredictionForm';

interface MatchInfoProps {
  event: MatchData;
  predictions?: Prediction[];
}

const MatchInfo: React.FC<MatchInfoProps> = ({
  event,
  predictions: initialPreds,
}) => {
  const { data: user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? '';

  const { events } = useFilteredEvents();

  const { data: matchData } = useGetMatchQueryV2(event.id);

  const liveEvent = matchData ?? event;

  const notStarted = liveEvent.status === 'NS';
  const isFinished =
    liveEvent.status === 'FT' ||
    liveEvent.status === 'AET' ||
    liveEvent.status === 'AP';
  const isInProgress =
    liveEvent.status.includes("'") || liveEvent.status === 'HT';

  const { data: userPred, refetch: refetchUserPred } = useMyPrediction(
    userId,
    event.id,
  );

  const {
    data: allPredictions,
    refetch: refetchAllPreds,
    isLoading: loadingAllPreds,
  } = useGetEventPredictionsV2(event.id, initialPreds);

  const handleSave = async (values: { home: string; away: string }) => {
    const payload: PredictionPayload = {
      event_id: event.id,
      competition_id: event.competitionid,
      home_score: parseInt(values.home, 10),
      away_score: parseInt(values.away, 10),
    };

    const res = await saveEventPrediction(payload);
    if (!res.ok) throw new Error(res.error || 'Error al guardar la predicción');

    toast.success('¡Predicción guardada con éxito!');
    await refetchUserPred();
    await refetchAllPreds();
  };

  const handleUpdate = async (values: { home: string; away: string }) => {
    const payload: PredictionUpdatePayload = {
      home_score: parseInt(values.home, 10),
      away_score: parseInt(values.away, 10),
    };

    const res = await updateEventPrediction(event.id, payload);
    if (!res.ok)
      throw new Error(res.error || 'Error al actualizar la predicción');

    toast.success('¡Predicción actualizada con éxito!');
    await refetchUserPred();
    await refetchAllPreds();
  };

  if (authLoading) {
    return (
      <>
        <EventNavigation currentId={event.id} events={events} />
        <div className="flex justify-center text-center items-center min-h-screen">
          <div className="text-text">
            <Spinner label="Cargando partido..." variant="wave" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />

      {events?.length > 0 && (
        <EventNavigation currentId={event.id} events={events} />
      )}

      <div className="match-info-container flex flex-col min-h-screen px-3 sm:px-4 bg-background text-text">
        <NoPredictionWarn status={event.status} prediction={userPred} />

        <PredictionForm
          key={liveEvent.id}
          event={liveEvent}
          initialPrediction={{
            home: userPred?.homeScore ?? '',
            away: userPred?.awayScore ?? '',
          }}
          disabled={!(liveEvent.status === 'NS')}
          isLoggedIn={!!user}
          onSubmit={userPred ? handleUpdate : handleSave}
        />

        <div className="my-4 h-px w-full bg-border" />

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
