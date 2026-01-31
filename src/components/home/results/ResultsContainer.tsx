import { MatchData } from '@/types/events/events.types';
import ResultsList from './ResultsList';

interface ResultsContainerProps {
  full?: boolean;
  results: MatchData[];
  loading?: boolean;
  error?: Error | null;
}

export default function ResultsContainer({
  results,
  loading,
  error,
}: ResultsContainerProps) {
  return (
    <div className="container sm:max-w-none sm:p-0 sm:flex sm:gap-4 sm:w-full">
      <main className="mt-2 sm:mt-0 sm:flex-auto">
        <h1 className="text-2xl font-bold text-center bg-secondary text-white rounded-lg p-2 mb-4">
          Resultados
        </h1>
        <ResultsList results={results} isLoading={loading} error={error} />
      </main>
    </div>
  );
}
