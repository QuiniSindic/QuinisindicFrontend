'use client';

import { Button } from '@heroui/react';

interface PredictionButtonProps {
  isNS: boolean;
  isLoggedIn: boolean;
  isValid: boolean;
  saving: boolean;
  hasPrediction: boolean;
}

export default function PredictionButton({
  isNS,
  isLoggedIn,
  isValid,
  saving,
  hasPrediction,
}: PredictionButtonProps) {
  if (!isNS) return null; // solo mostrar en estado NS

  const label = hasPrediction ? 'Actualizar predicción' : 'Guardar predicción';

  const enabled = 'bg-brand text-brand-contrast hover:opacity-90';
  const disabled = 'bg-muted text-background cursor-not-allowed';

  return (
    <>
      {/* Mobile: botón fijo */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden mb-4">
        <div className="px-3 pb-[env(safe-area-inset-bottom)] bg-background/80 backdrop-blur-sm border-t border-border">
          {isLoggedIn ? (
            <Button
              type="submit"
              isLoading={saving}
              disabled={!isValid || saving}
              className={`
                w-full h-12 font-semibold rounded-xl mt-2
                ${!isValid ? enabled : disabled}
              `}
            >
              {label}
            </Button>
          ) : (
            <Button disabled className="w-full h-12 rounded-xl mt-2">
              Inicia sesión para guardar
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: botón normal bajo inputs */}
      <div className="hidden lg:flex justify-center mt-3 w-full">
        {isLoggedIn ? (
          <Button
            type="submit"
            isLoading={saving}
            disabled={!isValid || saving}
            className={`
              px-6 h-10 font-medium rounded-lg
              ${!isValid ? enabled : disabled}`}
          >
            {label}
          </Button>
        ) : (
          <Button disabled>Inicia sesión para guardar</Button>
        )}
      </div>
    </>
  );
}

// old v1
/**
 * 
 * return (
    <div className="flex justify-center mt-2 w-full">
      {isLoggedIn ? (
        <Button
          type="submit"
          isLoading={saving}
          disabled={!isValid || saving}
          className={`group relative text-white flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md
            ${!isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-secondary/90'}`}
        >
          {hasPrediction ? 'Actualizar predicción' : 'Guardar predicción'}
        </Button>
      ) : (
        <Button className="cursor-not-allowed" disabled={!isLoggedIn}>
          Inicia sesión para guardar
        </Button>
      )}
    </div>
  );
 * 
 */
