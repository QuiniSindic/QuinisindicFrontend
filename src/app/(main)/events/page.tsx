import EventsList from '@/src/components/home/events/EventsList';
import FilterBar from '@/src/components/results/FilterBar';

export default function EventsPage() {
  return (
    <div className="mb-4 mx-4 sm:mx-8 md:mx-8 lg:mx-12 xl:mx-12 min-h-screen">
      <div className="container sm:max-w-none sm:p-0 sm:flex sm:gap-4 sm:w-full">
        <main className="mt-2 sm:mt-0 sm:flex-auto">
          <h1 className="text-2xl font-bold text-center bg-secondary text-white rounded-lg p-2 mb-4">
            Eventos
          </h1>
          <FilterBar mode="events" />
          <EventsList full mode="events" />
        </main>
      </div>
    </div>
  );
}
