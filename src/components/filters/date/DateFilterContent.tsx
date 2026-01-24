import { useDateFilters } from '@/src/hooks/useDateFilters';
import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import { RotateCcw } from 'lucide-react';
import { CarouselScrollContainer } from '../../ui/CarouselScrollContainer';
import { DateFilterActions } from './DateFilterActions';
import { DateFilterInput } from './DateFilterInput';

interface DateFilterContentProps {
  closeWrapper: () => void;
}

export const DateFilterContent = ({ closeWrapper }: DateFilterContentProps) => {
  const {
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
    clearDates,
  } = useSportsFilter();

  const { setToday, setYesterday, setLast7Days } = useDateFilters(
    (date) => setSelectedFrom(date),
    (date) => setSelectedTo(date),
  );

  return (
    <div className="flex flex-col gap-4 w-full md:w-[320px]">
      <div className="grid grid-cols-2 gap-3 mt-2">
        <DateFilterInput
          label="Desde"
          value={selectedFrom}
          onChange={setSelectedFrom}
        />

        <DateFilterInput
          label="Hasta"
          value={selectedTo}
          onChange={setSelectedTo}
        />
      </div>

      {/* quick dates (hoy, ayer, last week) */}
      <div className="-mx-1 md:mx-0">
        {/* mobile */}
        <div className="md:hidden">
          <CarouselScrollContainer contentClassName="gap-2">
            <DateFilterActions
              setToday={setToday}
              setYesterday={setYesterday}
              setLast7Days={setLast7Days}
              closePopover={closeWrapper}
            />
          </CarouselScrollContainer>
        </div>

        {/* desktop*/}
        <div className="hidden md:flex flex-wrap gap-2 justify-start">
          <DateFilterActions
            setToday={setToday}
            setYesterday={setYesterday}
            setLast7Days={setLast7Days}
            closePopover={closeWrapper}
          />
        </div>
      </div>

      {/* footer buttons */}
      <div className="flex justify-between items-center pt-2 border-t border-white/10">
        <button
          onClick={clearDates}
          className="text-xs text-danger hover:text-danger-400 flex items-center gap-1"
        >
          <RotateCcw size={12} /> Limpiar
        </button>
        <button
          onClick={closeWrapper}
          className="text-xs font-bold text-focus hover:underline"
        >
          Listo
        </button>
      </div>
    </div>
  );
};
