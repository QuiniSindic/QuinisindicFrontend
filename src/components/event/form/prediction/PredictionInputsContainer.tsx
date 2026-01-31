'use client';

import { FormValues, MatchData } from '@/types/events/events.types';
import { UseFormSetValue } from 'react-hook-form';
import { ScoreInputsContainer } from './ScoreInputsContainer';

type PredictionInputsContainerProps = {
  event: MatchData;
  home: string;
  away: string;
  setValue: UseFormSetValue<FormValues>;
  disabled?: boolean;
  hasPrediction: boolean;
  clamp: (v: string) => string;
};

export default function PredictionInputsContainer({
  event,
  home,
  away,
  setValue,
  disabled,
  hasPrediction,
  clamp,
}: PredictionInputsContainerProps) {
  const isNS = event.status === 'NS';
  const isFT = event.status === 'FT';
  const isLive = !isNS && !isFT;

  if (isFT) {
    return (
      <p className="my-6 text-muted text-center">
        El partido ya finalizó.
        {!hasPrediction &&
          ' No tenías ninguna predicción activa para este partido.'}
        {hasPrediction && ` Tu predicción fue ${home || '—'} - ${away || '—'}.`}
      </p>
    );
  }

  if (isLive && !hasPrediction) {
    return (
      <p className="my-6 text-muted text-center">
        No tenías ninguna predicción activa para este partido.
      </p>
    );
  }

  return (
    <ScoreInputsContainer
      home={home}
      away={away}
      setValue={setValue}
      clamp={clamp}
      disabled={disabled}
    />
  );
}
