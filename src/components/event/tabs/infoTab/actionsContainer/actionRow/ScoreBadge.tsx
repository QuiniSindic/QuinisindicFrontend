import React from 'react';

interface ScoreBadgeProps {
  score?: {
    home: number;
    away: number;
  };
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const scoreText = `${score?.home}-${score?.away}`;

  if (score) {
    return (
      <span
        className="
          ml-2 inline-flex h-6 min-w-10 items-center justify-center
          rounded-full px-2 text-xs font-semibold tabular-nums
          border border-border bg-surface text-text
        "
        title={scoreText}
      >
        {scoreText}
      </span>
    );
  }

  return <span className="ml-2 h-6" />;
};
