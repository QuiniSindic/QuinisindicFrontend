import React from 'react';

export const ScoreBadge: React.FC<{ score?: string }> = ({ score }) => {
  if (score) {
    return (
      <span
        className="
          ml-2 inline-flex h-6 min-w-10 items-center justify-center
          rounded-full px-2 text-xs font-semibold tabular-nums
          border border-border bg-surface text-text
        "
        title={score}
      >
        {score}
      </span>
    );
  }

  return <span className="ml-2 h-6" />;
};
