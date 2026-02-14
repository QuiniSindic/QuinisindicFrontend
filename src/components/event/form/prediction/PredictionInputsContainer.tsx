'use client';

import { FormValues, MatchData } from '@/types/domain/events';
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
  const isFT =
    event.status === 'FT' || event.status === 'AET' || event.status === 'AP';
  const isLive = !isNS && !isFT;

  // --- ESTILOS COMUNES PARA TEXTO (LIVE y FT) ---
  // Extraemos esto para que el diseño sea consistente si ganó o si está jugando
  const PredictionTextDisplay = ({
    label,
    subLabel,
  }: {
    label: string;
    subLabel: string;
  }) => (
    <div className="my-6 flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
      {/* Etiqueta de estado */}
      <div className="px-3 py-1 rounded-full bg-surface border border-border/60 shadow-sm">
        <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">
          {label}
        </span>
      </div>

      {/* Marcador Grande */}
      <div className="flex flex-col items-center">
        <span className="text-4xl sm:text-5xl font-black text-text tracking-tighter">
          {home} - {away}
        </span>
        <span className="text-xs sm:text-sm text-brand font-medium mt-1">
          {subLabel}
        </span>
      </div>
    </div>
  );

  // CASO 1: PARTIDO TERMINADO
  if (isFT) {
    if (hasPrediction) {
      return (
        <PredictionTextDisplay
          label="Partido Finalizado"
          subLabel="Tu pronóstico final"
        />
      );
    }
    return (
      <div className="my-6 text-center">
        <p className="text-muted font-medium mb-1">El partido ha finalizado</p>
        <p className="text-sm text-muted/70">
          No realizaste ninguna predicción.
        </p>
      </div>
    );
  }

  // CASO 2: PARTIDO EN JUEGO (LIVE)
  if (isLive) {
    if (hasPrediction) {
      // AQUI EL CAMBIO: Ya no mostramos inputs, sino texto grande
      return (
        <PredictionTextDisplay
          label="Predicción Cerrada"
          subLabel="Tu pronóstico activo"
        />
      );
    } else {
      // NO HAY PREDICCIÓN
      return (
        <div className="my-8 text-center p-6 bg-surface/50 rounded-xl border border-dashed border-border/60">
          <p className="text-text font-medium">No hay predicción activa</p>
          <p className="text-xs text-muted mt-2">
            El partido ya ha comenzado y se cerraron las apuestas.
          </p>
        </div>
      );
    }
  }

  // CASO 3: NO EMPEZADO (NS) - Inputs normales editables
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
