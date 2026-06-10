'use client';

import React from 'react';

interface TimelineDividerProps {
  title: string;
}

export const TimelineDivider: React.FC<TimelineDividerProps> = ({ title }) => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-2">
    <div className="h-px bg-border/70" />
    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
      {title}
    </span>
    <div className="h-px bg-border/70" />
  </div>
);
