'use client';

import { FormValues, MatchData } from '@/types/domain/events';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import PredictionButton from './prediction/PredictionButton';
import PredictionInputsContainer from './prediction/PredictionInputsContainer';
import TeamHeader from './teamHeader/TeamHeader';

interface Props {
  event: MatchData;
  initialPrediction: { home: number | string; away: number | string };
  disabled?: boolean;
  isLoggedIn: boolean;
  onSubmit: (vals: FormValues) => Promise<void>;
  createLabel?: string;
  updateLabel?: string;
}

export default function PredictionForm({
  event,
  initialPrediction,
  disabled = false,
  isLoggedIn,
  onSubmit,
  createLabel,
  updateLabel,
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
  const inputsDisabled = disabled || matchIsLive;

  const hasPrediction =
    initialPrediction.home !== '' &&
    initialPrediction.home !== null &&
    initialPrediction.home !== undefined &&
    initialPrediction.away !== '' &&
    initialPrediction.away !== null &&
    initialPrediction.away !== undefined;

  useEffect(() => {
    reset(defaults);
  }, [event.id, defaults, reset]);

  const clamp = (v: string) => {
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
      className="flex flex-col items-center w-full"
    >
      {/* === TARJETA DE MARCADOR (SCOREBOARD CARD) ===
        Agrupa equipos e inputs en un bloque visual cohesivo.
      */}
      <div className="w-full bg-surface border border-border/60 rounded-2xl shadow-sm overflow-hidden relative">
        {/* Fondo decorativo sutil (opcional) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand/50 to-transparent opacity-50" />

        <div className="p-4 sm:p-6 flex flex-col gap-6">
          {/* Cabecera de Equipos */}
          <TeamHeader event={event} />

          {/* Inputs de Predicción */}
          {/* Los integramos visualmente dentro de la misma tarjeta */}
          <div className="mt-2">
            <PredictionInputsContainer
              event={event}
              home={home}
              away={away}
              setValue={setValue}
              disabled={inputsDisabled}
              hasPrediction={hasPrediction}
              clamp={clamp}
            />
          </div>
        </div>

        {/* Footer de la tarjeta con estado (Opcional, para dar info extra) */}
        {isNS && (
          <div className="bg-background/50 px-4 py-2 text-center border-t border-border/50">
            <p className="text-xs text-muted">
              {hasPrediction
                ? 'Tienes una predicción guardada'
                : 'Introduce tu pronóstico antes del inicio'}
            </p>
          </div>
        )}
      </div>

      {/* === FLOATING ACTION BAR (Botón Fijo) === 
        Se queda pegado abajo, encima de la navegación móvil.
        backdrop-blur para efecto moderno tipo iOS/Glassmorphism.
      */}
      <div
        className="fixed bottom-15 md:bottom-0 left-0 w-full z-40 px-4 py-3 
          bg-background/80 backdrop-blur-md border-t border-border/50 
          md:relative md:bg-transparent md:border-0 md:backdrop-blur-none md:p-0 md:mt-6 md:z-0
          flex justify-center transition-all duration-300"
      >
        <div className="w-full max-w-sm md:max-w-xs shadow-lg md:shadow-none rounded-xl">
          <PredictionButton
            isNS={isNS}
            isLoggedIn={isLoggedIn}
            isValid={isValid}
            saving={saving}
            hasPrediction={hasPrediction}
            createLabel={createLabel}
            updateLabel={updateLabel}
          />
        </div>
      </div>
    </form>
  );
}
