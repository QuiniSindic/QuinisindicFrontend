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

  const enabled = 'bg-muted text-brand-contrast hover:opacity-90';
  const disabled = 'bg-brand text-background cursor-not-allowed';

  return (
    <>
      {/* Mobile: botón fijo */}
      <div className="w-full flex justify-center sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-t border-border/50 md:static md:bg-transparent md:border-0 md:py-0 mt-4">
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden mb-4">
          <div className="px-3 pb-[env(safe-area-inset-bottom)] bg-background/80 backdrop-blur-sm">
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
