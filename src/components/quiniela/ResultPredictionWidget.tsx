import { Partido } from '@/types/domain/quiniela';
import ResultPredictionButtons from './ResultPredictionButtons';

interface ResultPredictionWidgetProps {
  partido: Partido;
}

export default function ResultPredictionWidget({
  partido,
}: ResultPredictionWidgetProps) {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="flex justify-center items-center gap-8 w-full">
        <div className="flex items-center gap-2">
          <span className="text-right">{partido.local}</span>
          <div className="bg-orange-400 w-8 h-8"></div>{' '}
          {/* This is a placeholder, cambiar por el escudo */}
          {/* <Image
                src={partido.local_crest as string}
                alt={partido.local}
                width={32}
                height={32}
                className="object-contain"
              /> */}
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-orange-400 w-8 h-8"></div>
          {/* <Image
                src={partido.visitante_crest as string}
                alt={partido.visitante}
                width={32}
                height={32}
                className="object-contain"
              /> */}
          <span className="text-left">{partido.visitante}</span>
        </div>
      </div>

      <ResultPredictionButtons />
    </div>
  );
}
