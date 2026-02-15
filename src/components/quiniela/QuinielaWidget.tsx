import { Partido } from '@/types/domain/quiniela';
import NormalPredictionWidget from './NormalPredictionWidget';
import ResultPredictionWidget from './ResultPredictionWidget';

interface QuinielaWidgetProps {
  partido: Partido;
  isLastMatch?: boolean;
}

export default function QuinielaWidget({
  partido,
  isLastMatch = false,
}: QuinielaWidgetProps) {
  if (isLastMatch) {
    return <ResultPredictionWidget partido={partido} />;
  }

  return <NormalPredictionWidget partido={partido} />;
}
