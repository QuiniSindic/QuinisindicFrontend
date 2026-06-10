import { EventStatusFilter } from '@/types/domain/filters';

interface StatusFilterProps {
  value: EventStatusFilter;
  onChange: (filter: EventStatusFilter) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {

  return (
    <div className="flex w-full bg-surface rounded-xl gap-1">
      <button
        type="button"
        onClick={() => onChange('live')}
        className={`
              flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 
              flex items-center justify-center gap-2.5
              ${
                value === 'live'
                  ? 'bg-brand text-brand-contrast shadow-md scale-[1.02]'
                  : 'text-text hover:bg-background active:scale-[0.98]'
              }
            `}
      >
        En Vivo
      </button>

      <button
        type="button"
        onClick={() => onChange('upcoming')}
        className={`
              flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 
              flex items-center justify-center gap-2.5
              ${
                value === 'upcoming'
                  ? 'bg-brand text-brand-contrast shadow-md scale-[1.02]'
                  : 'text-text hover:bg-background active:scale-[0.98]'
              }
            `}
      >
        Próximos
      </button>
    </div>
  );
};
