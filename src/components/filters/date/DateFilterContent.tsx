import { useDateFilters } from '@/hooks/useDateFilters';
import { RotateCcw } from 'lucide-react';
import { CarouselScrollContainer } from '../../ui/CarouselScrollContainer';
import { DateFilterActions } from './DateFilterActions';
import { DateFilterInput } from './DateFilterInput';

interface DateFilterContentProps {
  selectedFrom: string | null;
  selectedTo: string | null;
  setSelectedFrom: (value?: string | null) => void;
  setSelectedTo: (value?: string | null) => void;
  setDateRange: (from?: string | null, to?: string | null) => void;
  clearDates: () => void;
  closeWrapper: () => void;
}

export const DateFilterContent = ({
  selectedFrom,
  selectedTo,
  setSelectedFrom,
  setSelectedTo,
  setDateRange,
  clearDates,
  closeWrapper,
}: DateFilterContentProps) => {
  const { setToday, setYesterday, setLast7Days } = useDateFilters(setDateRange);

  return (
    <div
      className="flex flex-col gap-4 w-full md:w-[320px]"
      role="group"
      aria-label="Filtro de fechas"
    >
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

      <div className="-mx-1 md:mx-0">
        {/* MOBILE */}
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

        {/* DESKTOP */}
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
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <button
          type="button"
          onClick={clearDates}
          className="
            text-xs text-muted flex items-center gap-1
            hover:text-text transition-colors
          "
        >
          <RotateCcw size={12} aria-hidden="true" /> Limpiar
        </button>
        <button
          type="button"
          onClick={closeWrapper}
          className="text-xs font-bold text-brand hover:underline"
        >
          Listo
        </button>
      </div>
    </div>
  );
};
