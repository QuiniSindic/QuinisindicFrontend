'use client';

import { useSportsFilter } from '@/src/store/sportsLeagueFilterStore';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DateFilterContent } from './DateFilterContent';

export const DateFilter = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [placement, setPlacement] = useState<'bottom-start' | 'bottom-end'>(
    'bottom-end',
  );

  const {
    selectedFrom,
    selectedTo,
    clearDates,
    selectedSport,
    selectedLeague,
  } = useSportsFilter();

  const desktopContainerRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = !!(selectedFrom || selectedTo);

  useEffect(() => {
    const calculatePlacement = () => {
      if (desktopContainerRef.current) {
        const rect = desktopContainerRef.current.getBoundingClientRect();
        const screenCenter = window.innerWidth / 2;

        // Si el borde izquierdo del botón está en la mitad izquierda de la pantalla,
        // alineamos el popover al inicio (start). Si no, al final (end).
        setPlacement(rect.left < screenCenter ? 'bottom-start' : 'bottom-end');
      }
    };

    const timeoutId = setTimeout(calculatePlacement, 100);

    // Calcular al montar
    calculatePlacement();

    // Recalcular si se redimensiona la ventana
    window.addEventListener('resize', calculatePlacement);
    return () => {
      window.removeEventListener('resize', calculatePlacement);
      clearTimeout(timeoutId);
    };
  }, [selectedSport, selectedLeague]);

  // Helper para acortar el texto de la fecha (DD/MM) y ahorrar espacio
  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
  };

  const summaryLabel = hasActiveFilters
    ? selectedFrom === selectedTo
      ? formatDateShort(selectedFrom!)
      : `${formatDateShort(selectedFrom!)} - ${formatDateShort(selectedTo!)}`
    : 'Fechas';

  // const summaryLabel = hasActiveFilters
  //   ? selectedFrom === selectedTo
  //     ? `Día: ${selectedFrom}`
  //     : `${selectedFrom} -> ${selectedTo}`
  //   : 'Filtrar por fecha';
  return (
    <>
      {/* --- VERSIÓN MÓVIL (Acordeón) --- */}
      <div className="md:hidden w-full bg-secondary/50 rounded-lg border border-white/5 overflow-hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2 text-white/90 overflow-hidden">
            <CalendarDays size={16} className="shrink-0" />
            <span className="text-sm font-semibold truncate">
              {hasActiveFilters ? summaryLabel : 'Filtrar por fecha'}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform shrink-0 ${isMobileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isMobileOpen && (
          <div className="p-3 pt-0 border-t border-white/5 ">
            <DateFilterContent closeWrapper={() => setIsMobileOpen(false)} />
          </div>
        )}
      </div>

      {/* --- VERSIÓN PC (Popover Compacto) --- */}
      <div className="hidden md:block" ref={desktopContainerRef}>
        <Popover
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          placement={placement}
          showArrow={true}
          offset={10}
          classNames={{
            content:
              'bg-[#2a0e45]/95 backdrop-blur-md border border-white/10 p-4 outline-none rounded-lg',
          }}
        >
          <PopoverTrigger>
            <button
              className={`
              flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer select-none
              max-w-40 
              ${
                hasActiveFilters || isPopoverOpen
                  ? 'bg-focus text-secondary shadow-md'
                  : 'bg-secondary text-white border border-white/10 hover:bg-secondary/80'
              }
            `}
            >
              <CalendarDays size={16} className="shrink-0" />

              {/* Texto truncado para que no rompa el layout */}
              <span className="truncate min-w-0 flex-1 text-left">
                {summaryLabel}
              </span>

              {hasActiveFilters ? (
                <div
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDates();
                  }}
                  className="shrink-0 ml-1 p-0.5 rounded-full hover:bg-black/20"
                >
                  <X size={12} />
                </div>
              ) : (
                <ChevronDown size={14} className="shrink-0 opacity-50" />
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent>
            <DateFilterContent closeWrapper={() => setIsPopoverOpen(false)} />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
