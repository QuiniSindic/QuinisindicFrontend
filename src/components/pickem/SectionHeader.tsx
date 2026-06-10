import type { ReactNode } from 'react';
import { DeadlinePill } from './DeadlinePill';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  deadline: string;
  locked: boolean;
  action: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  deadline,
  locked,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/80 pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-text">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
        <div className="mt-3">
          <DeadlinePill label="Deadline" deadline={deadline} locked={locked} />
        </div>
      </div>
      {action}
    </div>
  );
}
