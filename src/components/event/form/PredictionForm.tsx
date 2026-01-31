'use client';

import { FormValues, MatchData } from '@/types/events/events.types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import PredictionButton from './prediction/PredictionButton';
import PredictionInputsContainer from './prediction/PredictionInputsContainer';
import TeamHeader from './teamHeader/TeamHeader';

interface Props {
  event: MatchData;
  initialPrediction: { home: number | string; away: number | string };
  disabled?: boolean; // deshabilita inputs si no es NS
  isLoggedIn: boolean;
  onSubmit: (vals: FormValues) => Promise<void>;
}

export default function PredictionForm({
  event,
  initialPrediction,
  disabled = false,
  isLoggedIn,
  onSubmit,
}: Props) {
  const defaults = useMemo<FormValues>(
    () => ({
      home:
        initialPrediction.home === '' || initialPrediction.home === null
          ? ''
          : String(initialPrediction.home),
      away:
        initialPrediction.away === '' || initialPrediction.away === null
          ? ''
          : String(initialPrediction.away),
    }),
    [initialPrediction.home, initialPrediction.away],
  );

  const { handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: defaults,
  });
  const home = watch('home');
  const away = watch('away');

  const [saving, setSaving] = useState(false);

  const isValid = home.trim() !== '' && away.trim() !== '';
  const isNS = event.status === 'NS';
  const isFT = event.status === 'FT';
  const matchIsLive = !isNS && !isFT;

  const hasPrediction = defaults.home !== '' || defaults.away !== '';

  const inputsDisabled = disabled || matchIsLive;

  // ✅ reset cuando cambia partido o llega userPred
  useEffect(() => {
    reset(defaults);
  }, [event.id, defaults, reset]);

  const clamp = (v: string) => {
    // solo enteros [0..99]
    if (v === '') return v;
    const n = Math.max(0, Math.min(99, parseInt(v, 10) || 0));
    return String(n);
  };

  return (
    <form
      onSubmit={handleSubmit(async (vals) => {
        try {
          setSaving(true);
          await onSubmit({ home: clamp(vals.home), away: clamp(vals.away) });
        } finally {
          setSaving(false);
        }
      })}
      className="flex flex-col items-center"
    >
      <TeamHeader event={event} />

      <PredictionInputsContainer
        event={event}
        home={home}
        away={away}
        setValue={setValue}
        disabled={inputsDisabled}
        hasPrediction={hasPrediction}
        clamp={clamp}
      />

      <PredictionButton
        isNS={isNS}
        isLoggedIn={isLoggedIn}
        isValid={isValid}
        saving={saving}
        hasPrediction={hasPrediction}
      />
    </form>
  );
}
