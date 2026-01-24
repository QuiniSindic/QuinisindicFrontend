'use client';
import React from 'react';

interface TimelineDividerProps {
  title?: string;
  children?: React.ReactNode;
  position?: 'header' | 'footer';
  className?: string;
}

export const TimelineDivider: React.FC<TimelineDividerProps> = ({
  title,
  children,
  position = 'header',
  className = '',
}) => {
  const Line = (
    <div className="flex items-center my-4">
      <div className="grow h-px bg-border" />
      {title && (
        <span className="mx-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </span>
      )}
      <div className="grow h-px bg-border" />
    </div>
  );

  // container con espacio entre rows
  if (!title) return <div className={`space-y-3 ${className}`}>{children}</div>;

  if (position === 'header') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Line}
        <div className="space-y-3">{children}</div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-3">{children}</div>
      {Line}
    </div>
  );
};
