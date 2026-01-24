import { FormValues } from '@/src/types/events/events.types';
import { UseFormSetValue } from 'react-hook-form';
import ScoreInput from './ScoreInput';

interface ScoreInputsContainerProps {
  home: string;
  away: string;
  setValue: UseFormSetValue<FormValues>;
  clamp: (value: string) => string;
  disabled?: boolean;
}

export const ScoreInputsContainer = ({
  home,
  away,
  setValue,
  clamp,
  disabled,
}: ScoreInputsContainerProps) => {
  return (
    <div className="flex justify-center gap-12 my-5">
      <div className="flex flex-col items-center">
        <ScoreInput
          value={home}
          onChange={(v) => setValue('home', clamp(v))}
          disabled={disabled}
        />
        <span className="mt-2 text-sm text-muted">Local</span>
      </div>

      <div className="flex flex-col items-center">
        <ScoreInput
          value={away}
          onChange={(v) => setValue('away', clamp(v))}
          disabled={disabled}
        />
        <span className="mt-2 text-sm text-muted">Visitante</span>
      </div>
    </div>
  );
};
