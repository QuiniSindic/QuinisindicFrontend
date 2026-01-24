import FilterBar from '@/src/components/filters/FilterBar';
import EventsList from '@/src/components/home/events/EventsList';

export default function EventsPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-foreground">Eventos</h1>

          <FilterBar mode="events" />

          <main>
            <EventsList full mode="events" />
          </main>
        </div>
      </div>
    </div>
  );
}
