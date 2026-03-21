'use client';

import { formatDateShort } from '@/utils/common/date';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { DateFilterContent } from './DateFilterContent';

interface DateFilterProps {
  selectedFrom: string | null;
  selectedTo: string | null;
  clearDates: () => void;
  setSelectedFrom: (value?: string | null) => void;
  setSelectedTo: (value?: string | null) => void;
  selectedSport?: string | null;
  selectedLeague?: string | null;
}

export const DateFilter = ({
  selectedFrom,
  selectedTo,
  clearDates,
  setSelectedFrom,
  setSelectedTo,
  selectedSport,
  selectedLeague,
}: DateFilterProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [placement, setPlacement] = useState<'bottom-start' | 'bottom-end'>(
    'bottom-end',
  );

  const contentId = useId();
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters = !!(selectedFrom || selectedTo);

  useEffect(() => {
    const calculatePlacement = () => {
      if (desktopContainerRef.current) {
        const rect = desktopContainerRef.current.getBoundingClientRect();
        const screenCenter = window.innerWidth / 2;
        setPlacement(rect.left < screenCenter ? 'bottom-start' : 'bottom-end');
      }
    };

    const timeoutId = setTimeout(calculatePlacement, 100);
    calculatePlacement();
    window.addEventListener('resize', calculatePlacement);

    return () => {
      window.removeEventListener('resize', calculatePlacement);
      clearTimeout(timeoutId);
    };
  }, [selectedSport, selectedLeague]);

  const summaryLabel = !hasActiveFilters
    ? 'Fechas'
    : selectedFrom && selectedTo
      ? selectedFrom === selectedTo
        ? formatDateShort(selectedFrom)
        : `${formatDateShort(selectedFrom)} - ${formatDateShort(selectedTo)}`
      : formatDateShort(selectedFrom ?? selectedTo ?? '');

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden w-full bg-surface border border-border rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen((current) => !current)}
          aria-expanded={isMobileOpen}
          aria-controls={contentId}
          className="w-full flex items-center justify-between p-3 hover:bg-background transition-colors"
        >
          <div className="flex items-center gap-2 text-text overflow-hidden">
            <CalendarDays size={16} className="shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold truncate">
              {hasActiveFilters ? summaryLabel : 'Filtrar por fecha'}
            </span>
          </div>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform shrink-0 text-muted ${
              isMobileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isMobileOpen && (
          <div id={contentId} className="p-3 pt-0 border-t border-border">
            <DateFilterContent
              selectedFrom={selectedFrom}
              selectedTo={selectedTo}
              setSelectedFrom={setSelectedFrom}
              setSelectedTo={setSelectedTo}
              clearDates={clearDates}
              closeWrapper={() => setIsMobileOpen(false)}
            />
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block" ref={desktopContainerRef}>
        <div className="flex items-center gap-2">
          <Popover
            isOpen={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
            placement={placement}
            showArrow={true}
            offset={10}
            classNames={{
              content:
                'bg-surface text-text border border-border p-4 outline-none rounded-lg shadow-lg',
            }}
          >
            <PopoverTrigger>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isPopoverOpen}
                className={`
                  flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium
                  transition-colors cursor-pointer select-none max-w-40
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  ${
                    hasActiveFilters || isPopoverOpen
                      ? 'bg-brand text-brand-contrast'
                      : 'bg-surface text-text border border-border hover:bg-background'
                  }
                `}
              >
                <CalendarDays
                  size={16}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate min-w-0 flex-1 text-left">
                  {summaryLabel}
                </span>
                <ChevronDown
                  size={14}
                  className="shrink-0 text-current/80"
                  aria-hidden="true"
                />
              </button>
            </PopoverTrigger>

            <PopoverContent>
              <DateFilterContent
                selectedFrom={selectedFrom}
                selectedTo={selectedTo}
                setSelectedFrom={setSelectedFrom}
                setSelectedTo={setSelectedTo}
                clearDates={clearDates}
                closeWrapper={() => setIsPopoverOpen(false)}
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearDates}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:bg-background hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Limpiar fechas"
              title="Limpiar fechas"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
