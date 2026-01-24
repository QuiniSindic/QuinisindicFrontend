import FilterBar from '@/src/components/filters/FilterBar';
import EventsList from '@/src/components/home/events/EventsList';

export default function ResultsPage() {
  return (
    <div className="min-h-screen pb-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-text">Resultados</h1>

          <FilterBar mode="results" />

          <main>
            <EventsList full mode="results" />
          </main>
        </div>
      </div>
    </div>
  );
}
