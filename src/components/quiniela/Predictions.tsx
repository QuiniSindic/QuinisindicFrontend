import { Partido } from '@/types/quiniela.types';
import SaveButton from '../ui/buttons/SaveButton';
import QuinielaWidget from './QuinielaWidget';

interface PredictionsProps {
  partidos: Partido[];
  predictions: string[];
}

export default function Predictions({
  partidos,
  predictions,
}: PredictionsProps) {
  return (
    <div className="grid gap-4">
      {partidos.map((partido, index) => (
        <QuinielaWidget
          key={index}
          partido={partido}
          isLastMatch={index === 14}
          predictions={predictions}
        />
      ))}
      <div className="flex justify-center">
        <SaveButton label="Guardar quiniela" />
      </div>
    </div>
  );
}
