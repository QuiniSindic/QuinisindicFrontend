import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import EventsList from './EventsList';

interface EventsContainerProps {
  isLoading?: boolean;
}

export default function EventsContainer({ isLoading }: EventsContainerProps) {
  const { selectedLeague } = useSportsFilter();

  return (
    <div
      className={`sm:flex sm:gap-4 sm:w-full transition-all duration-300 ${
        selectedLeague ? 'lg:w-3/5' : 'lg:w-full'
      }`}
    >
      <main className="mt-2 sm:mt-0 lg:mt-0 sm:flex-auto">
        {/* mobile hasta 640px */}
        <h2 className="text-2xl font-semibold text-text px-1 mb-2 sm:hidden">
          Eventos
        </h2>

        {/* large a partir de 640px */}
        <h1 className="hidden sm:block text-2xl font-bold text-center bg-surface text-text border border-border rounded-lg p-2 mb-4">
          Eventos
        </h1>

        <EventsList isLoading={isLoading} />
      </main>
    </div>
  );
}
