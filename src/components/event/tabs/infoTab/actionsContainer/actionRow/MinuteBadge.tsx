import React from 'react';

export const MinuteBadge: React.FC<{ label: string }> = ({ label }) => (
  <span
    className="
      inline-flex h-7 min-w-12 items-center justify-center
      rounded-full px-2.5 text-xs font-semibold tabular-nums
      bg-brand/10 text-brand border border-brand/20
    "
    title={`Minuto ${label}`}
  >
    {label}
  </span>
);
