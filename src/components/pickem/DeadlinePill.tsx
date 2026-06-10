import { CalendarClock, Lock } from 'lucide-react';
import { formatDeadline } from './pickem.utils';

type DeadlinePillProps = {
  label: string;
  deadline: string;
  locked: boolean;
};

export function DeadlinePill({ label, deadline, locked }: DeadlinePillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-muted shadow-sm">
      {locked ? (
        <Lock className="h-3.5 w-3.5 text-brand" aria-hidden />
      ) : (
        <CalendarClock className="h-3.5 w-3.5 text-brand" aria-hidden />
      )}
      <span className="text-text">{label}</span>
      <span>{locked ? 'cerrado' : formatDeadline(deadline)}</span>
    </div>
  );
}
