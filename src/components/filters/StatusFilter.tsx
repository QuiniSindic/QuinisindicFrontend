import { useSportsFilter } from '@/store/sportsLeagueFilterStore';

export const StatusFilter = () => {
  const { statusFilter, setStatusFilter } = useSportsFilter();

  return (
    <div className="flex w-full bg-surface rounded-xl gap-1">
      <button
        onClick={() => setStatusFilter('live')}
        className={`
              flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 
              flex items-center justify-center gap-2.5
              ${
                statusFilter === 'live'
                  ? 'bg-brand text-brand-contrast shadow-md scale-[1.02]'
                  : 'text-text hover:bg-background active:scale-[0.98]'
              }
            `}
      >
        En Vivo
      </button>

      <button
        onClick={() => setStatusFilter('upcoming')}
        className={`
              flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 
              flex items-center justify-center gap-2.5
              ${
                statusFilter === 'upcoming'
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
