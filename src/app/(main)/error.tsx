'use client';

import { useEffect } from 'react';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold text-text">Error</h1>
      <p className="text-muted">
        No se ha podido cargar este evento. Intentalo de nuevo más tarde.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
