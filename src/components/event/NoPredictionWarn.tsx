import { MatchData } from '@/types/events/events.types';

interface NoPredictionWarnProps {
  status: MatchData['status'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prediction: any; // FIX tipado
}

export const NoPredictionWarn: React.FC<NoPredictionWarnProps> = ({
  status,
  prediction,
}) => {
  const notStarted = status === 'NS';

  return (
    notStarted &&
    !prediction && (
      <div className="text-center mb-4">
        <h1>Realiza la predicción para el siguiente partido</h1>
      </div>
    )
  );
};
