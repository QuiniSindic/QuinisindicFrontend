'use client';

import { LoaderCircle, Share2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { usePickem } from './PickemProvider';
import { sharePickemSummary } from './pickem.share';

export function PickemShareButton() {
  const {
    state: { contest, groupOrder, awardState, currentUser },
    meta: { awardCandidates, hasSavedGroupPicks, isPending },
  } = usePickem();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!hasSavedGroupPicks) {
      toast.error('Guarda primero tus grupos para compartir el resumen.');
      return;
    }

    setIsSharing(true);
    const toastId = toast.loading('Generando imagen...');

    try {
      const result = await sharePickemSummary({
        contest,
        groupOrder,
        awardState,
        awardCandidates,
        currentUser,
        url: window.location.href,
      });

      const messageByResult = {
        shared: 'Resumen compartido.',
        downloaded: 'Imagen descargada. Tambien puedes compartir el texto.',
        copied: 'Imagen descargada y texto copiado.',
      } satisfies Record<typeof result, string>;

      toast.success(messageByResult[result], { id: toastId });
    } catch (error) {
      const isAbort =
        error instanceof DOMException && error.name === 'AbortError';

      if (isAbort) {
        toast.dismiss(toastId);
      } else {
        toast.error('No se pudo generar el resumen para compartir.', {
          id: toastId,
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isPending || isSharing}
      aria-busy={isSharing}
      className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-bold text-text transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSharing ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden />
      )}
      {isSharing ? 'Generando...' : 'Compartir pickem'}
    </button>
  );
}
