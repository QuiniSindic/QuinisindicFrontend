import { NoDataToDisplay } from '@/src/components/ui/feedback/NoDataToDisplay';
import type { MatchData } from '@/src/types/events/events.types';
import { Spinner } from '@heroui/react';
import React from 'react';

interface MatchInfoOddsTabProps {
  event: MatchData;
  loadingAllOdds?: boolean;
}

const formatOdd = (odd?: number | string) => {
  if (odd == null) return '–';
  const n = Number(odd);
  if (!isFinite(n) || n <= 0) return '–';
  return n % 1 === 0 ? n.toString() : n.toFixed(2);
};

export const MatchInfoOddsTab: React.FC<MatchInfoOddsTabProps> = ({
  event,
  loadingAllOdds,
}) => {
  const odds = event?.Odds;

  if (loadingAllOdds) {
    return (
      <div className="flex items-center justify-center py-12 text-text">
        <Spinner />
      </div>
    );
  }

  if (!odds) {
    return (
      <NoDataToDisplay title="No hay cuotas disponibles para este partido." />
    );
  }

  const entries = [
    { label: event.homeTeam.name, odd: Number(odds.homeOdd), key: 'home' },
    { label: 'Empate', odd: Number(odds.drawOdd), key: 'draw' },
    { label: event.awayTeam.name, odd: Number(odds.awayOdd), key: 'away' },
  ];

  // Favourite = lowest price (highest implied probability)
  const favouriteKey = entries.reduce((min, e) =>
    e.odd < min.odd ? e : min,
  ).key;

  return (
    <div className="rounded-xl border border-border bg-surface/80 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {entries.map(({ label, odd, key }) => {
          const isFavourite = key === favouriteKey;

          return (
            <div
              key={key}
              className={`
                group rounded-lg p-4 transition
                border border-border bg-surface
                hover:bg-background
                focus-within:ring-2 focus-within:ring-ring
                focus-within:ring-offset-2 focus-within:ring-offset-background
                ${isFavourite ? 'border-brand/30 bg-brand/10' : ''}
              `}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-text truncate">
                  {label}
                </span>

                {isFavourite && (
                  <span
                    className="
                      rounded-full px-2 py-0.5 text-[10px]
                      font-semibold uppercase tracking-wide
                      bg-brand text-brand-contrast
                    "
                  >
                    Favorito
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold leading-none tabular-nums text-text">
                  {formatOdd(odd)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchInfoOddsTab;
