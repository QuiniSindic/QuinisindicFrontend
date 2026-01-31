import { Partido } from '@/types/quiniela.types';
import NormalPredictionButtons from './NormalPredictionButtons';

interface NormalPredictionWidgetProps {
  partido: Partido;
}

export default function NormalPredictionWidget({
  partido,
}: NormalPredictionWidgetProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-end gap-2 w-1/3">
        <span className="text-right">{partido.local}</span>
        <div className="bg-orange-400 w-8 h-8"></div>
        {/* <Image
            src={partidos[index].local_crest as string}
            alt={partidos[index].local}
            width={32}
            height={32}
            className="object-contain"
          /> */}
      </div>

      <NormalPredictionButtons />

      <div className="flex items-center justify-start gap-2 w-1/3">
        <div className="bg-orange-400 w-8 h-8"></div>
        {/* <Image
            src={partidos[index].visitante_crest as string}
            alt={partidos[index].visitante}
            width={32}
            height={32}
            className="object-contain"
          /> */}
        <span className="text-left">{partido.visitante}</span>
      </div>
    </div>
  );
}
